import cluster from 'cluster';
import { createServer } from 'http';

import { initMaster } from './master';
import { initWorker } from './worker';
import { requestListener } from './requestListener';

const server = createServer(requestListener);

if (cluster.isPrimary) {
    initMaster(server);
} else {
    initWorker(server);
}