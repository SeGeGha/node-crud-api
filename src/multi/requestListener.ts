import cluster from 'cluster';
import { IncomingMessage, ServerResponse } from 'http';

import { balancer } from './balancer';
import { router } from '../router';

export const requestListener = async (req: IncomingMessage, res: ServerResponse) => {
    if (cluster.isPrimary) {
        balancer(req, res);
    } else {
        res.setHeader('Process-Id', process.pid);

        router(req, res);
    }
};
