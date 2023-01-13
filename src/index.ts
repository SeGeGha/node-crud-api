import * as dotenv from 'dotenv'

import { server } from './server';

dotenv.config();

const { PORT } = process.env;

server.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
});
