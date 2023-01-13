import { createServer } from 'http';

import { router } from './router';

export const server = createServer(router);
