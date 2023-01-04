import { getUsers, getUser, createUser, updateUser, removeUser } from './controllers/userController';

export const router = async (req, res) => {
    if (req.url === '/api/users' && req.method === 'GET') {
        getUsers(res);
    } else if (req.url === '/api/users' && req.method === 'POST') {
        createUser(req, res);
    } else if (req.url.startsWith('/api/users/') && req.method === 'GET') {
        getUser(req, res);
    } else if (req.url.startsWith('/api/users/') && req.method === 'PUT') {
        updateUser(req, res);
    } else if (req.url.startsWith('/api/users/') && req.method === 'DELETE') {
        removeUser(req, res);
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Route not found' }));
    }
}