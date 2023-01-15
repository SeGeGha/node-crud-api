import { IncomingMessage, ServerResponse } from 'http';

import { getUsers, getUser, createUser, updateUser, removeUser } from './controllers/userController';

import { INVALID_ROUTE } from './constants/messages';

const routes = {
    users: (url: string) => url === '/api/users',
    user: (url: string) => url.startsWith('/api/users/') && !!url.replace('/api/users/', '').length && url.match(/\//g).length === 3,
}

export const router = async (req: IncomingMessage, res: ServerResponse) => {
    if (routes.users(req.url) && req.method === 'GET') {
        return getUsers(res);
    }
    if (routes.users(req.url) && req.method === 'POST') {
        return createUser(req, res);
    }
    if (routes.user(req.url) && req.method === 'GET') {
        return getUser(req, res);
    }
    if (routes.user(req.url) && req.method === 'PUT') {
        return updateUser(req, res);
    }
    if (routes.user(req.url) && req.method === 'DELETE') {
        return removeUser(req, res);
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: INVALID_ROUTE }));
}