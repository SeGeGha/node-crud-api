import { Server } from 'http';

export function initWorker(server: Server) {
    const { PORT } = process.env;

    server.listen(PORT, () => {
        console.log(`Server ${process.pid} running on port: ${PORT}`)
    });

    server.on('error', error => {
        console.log('Server running error:', error.message)
    });
}
