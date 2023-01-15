import dotenv from 'dotenv';
import os from 'os';
import cluster from 'cluster';
import { Server } from 'http';

dotenv.config();

export function initMaster(server: Server) {
    const cpus = os.cpus();
    const { PORT } = process.env;
    const workers: Record<number, number> = {};

    console.log(`Master ${process.pid} is running`);
    console.log(`Starting ${cpus.length} forks`);

    cpus.forEach((_, id) => {
        const WORKER_PORT = Number(PORT) + id + 1;
        const worker = cluster.fork({ PORT: WORKER_PORT });

        workers[worker.process.pid] = WORKER_PORT;
    });

    cluster.on('exit', worker => {
        const { pid } = worker.process;
        console.log(`Worker ${pid} died`);

        cluster.fork({ PORT: workers[pid] });
    });

    server.listen(PORT, () => {
        console.log(`Load balancer running on port: ${PORT}`)
    });

    server.on('error', error => {
        console.log('Load balancer running error:', error.message)
    });
}
