import dotenv from 'dotenv';
import os from 'os';
import cluster from 'cluster';
import childProcess from 'child_process';
import path from 'path';
import { Server } from 'http';
import { fileURLToPath } from 'url';

import { TWorkerList, TReqMessage, TResMessage } from '../types/worker';

dotenv.config();

export function initMaster(server: Server) {
    const cpus = os.cpus();
    const __dirname = path.dirname(fileURLToPath(import.meta.url));

    console.log(`Master ${process.pid} is running`);
    console.log(`Starting ${cpus.length} forks...`);

    const workers: TWorkerList = {};
    const dbChild = childProcess.fork(path.resolve(__dirname, 'db/childProcess.ts'));

    console.log(`Child process with DB ${dbChild.pid} forked`)

    cluster.on('message', (worker, message: TReqMessage) => {
        dbChild.send({
            ...message,
            workerPid: worker.process.pid,
        });
    });

    dbChild.on('message', (message: TResMessage) => {
        const { workerPid } = message;
        const { worker } = workers[workerPid] || {};
        if (!worker) {
            console.log(`Worker ${workerPid} not found`);
            return;
        }

        worker.send(message);
    });

    dbChild.on('error', error => {
        console.log('DB error:', error.message);
    });

    const { PORT } = process.env;

    cpus.forEach((_, id) => {
        const WORKER_PORT = Number(PORT) + id + 1;
        const worker = cluster.fork({ PORT: WORKER_PORT });

        workers[worker.process.pid] = {
            PORT: WORKER_PORT,
            worker,
        };
    });

    cluster.on('exit', worker => {
        const { pid } = worker.process;
        console.log(`Worker ${pid} died`);

        const { PORT } = workers[pid] || {};
        if (!PORT) {
            console.log(`Worker ${pid} not found`);
            return;
        }

        const newWorker = cluster.fork({ PORT });

        delete workers[pid];

        workers[newWorker.process.pid] = {
            PORT: Number(PORT),
            worker: newWorker,
        };
    });

    server.listen(PORT, () => {
        console.log(`Load balancer running on port: ${PORT}`)
    });

    server.on('error', error => {
        console.log('Load balancer running error:', error.message)
    });
}
