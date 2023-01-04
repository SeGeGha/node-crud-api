export const router = async (req, res) => {
    if (req.url === '/api/users' && req.method === 'GET') {

    } else if (req.url === '/api/users' && req.method === 'POST') {

    } else if (req.url.startsWith('/api/users/') && req.method === 'GET') {

    } else if (req.url.startsWith('/api/users/') && req.method === 'PUT') {

    } else if (req.url.startsWith('/api/users/') && req.method === 'DELETE') {

    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Route not found' }));
    }
}