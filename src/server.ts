import * as dotenv from 'dotenv';
import { createServer } from 'http';

dotenv.config();

const server = createServer(() => {});

const { PORT } = process.env;

server.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
});
