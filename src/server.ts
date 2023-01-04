import * as dotenv from 'dotenv';
import { createServer } from 'http';

import { router } from './router';

dotenv.config();

const server = createServer(router);

const { PORT } = process.env;

server.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
});
