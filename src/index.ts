import dotenv from 'dotenv';

import { server } from './server';

dotenv.config();

const { PORT } = process.env;

server.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});

server.on('error', error => {
    console.log('Server running error:', error.message);
});

process.on('SIGINT', () => process.exit());
