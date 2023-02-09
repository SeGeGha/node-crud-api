import cluster from 'cluster';
import { IncomingMessage, ServerResponse } from 'http';

import { balancer } from './balancer';

import { getReqBody } from '../utils/getReqBody';

import { TResMessage } from '../types/worker';

export const requestListener = async (req: IncomingMessage, res: ServerResponse) => {
    if (cluster.isPrimary) {
        balancer(req, res);
    } else {
        res.setHeader('Process-Id', process.pid);

        process.send({ method: req.method, url: req.url, body: await getReqBody(req)});

        process.once('message', (message: TResMessage) => {
            const { workerPid, statusCode, headers, body } = message;
            console.log(`Worker ${workerPid} has message from DB: statusCode - ${statusCode}, headers - ${JSON.stringify(headers)}, body - ${body}`);

            res.writeHead(statusCode, headers);
            res.end(body);
        });
    }
};
