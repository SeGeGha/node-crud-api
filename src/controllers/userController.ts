import { validate as validateId } from 'uuid';
import { IncomingMessage, ServerResponse } from 'http';

import * as User from '../models/userModel';

import { validateUserData } from '../validators/validateUserData';

import { getReqBody } from '../utils/getReqBody';
import { getUserId } from '../utils/getUserId';

import * as M from '../constants/messages';

// @desc Gets All Users
// @route GET /api/users
export const getUsers = async (res: ServerResponse) => {
    try {
        const users = await User.findAll();

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(users));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ title: M.UNKNOWN_ERROR, message: error.message }));
    }
};

// @desc Gets Single User
// @route GET /api/users/:id
export const getUser = async (req: IncomingMessage, res: ServerResponse) => {
    const id = getUserId(req.url);

    if (!validateId(id)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: M.INVALID_USER_ID + ` Id: ${id}` }));

        return;
    }

    try {
        const user = await User.findById(id);

        if (user) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(user));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: M.NON_EXISTENT_USER_ID + ` Id: ${id}` }));
        }
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ title: M.UNKNOWN_ERROR, message: error.message }));
    }
};

// @desc Create a User
// @route POST /api/users
export const createUser = async (req: IncomingMessage, res: ServerResponse) => {
    try {
        const body = 'body' in req ? req.body as string : await getReqBody(req);
        const { age, name, hobbies = [] } = JSON.parse(body);
        const userData = { age, name, hobbies };
        if (!validateUserData(userData)) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: M.INCORRECT_USER_DATA }));

            return;
        }

        const newUser = await User.create(userData);

        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(newUser));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ title: M.UNKNOWN_ERROR, message: error.message }));
    }
};

// @desc Update a User
// @route PUT /api/users/:id
export const updateUser = async (req: IncomingMessage, res: ServerResponse) => {
    const id = getUserId(req.url);

    if (!validateId(id)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: M.INVALID_USER_ID + ` Id: ${id}` }));

        return;
    }

    try {
        const user = await User.findById(id);

        if (user) {
            const body = 'body' in req ? req.body as string : await getReqBody(req);
            const { age, name, hobbies } = JSON.parse(body);
            const userData = {
                age: age || user.age,
                name: name || user.name,
                hobbies: hobbies || user.hobbies,
            };
            if (!validateUserData(userData)) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: M.INCORRECT_USER_DATA }));

                return;
            }

            const updatedUser = await User.update(id, userData);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(updatedUser));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: M.NON_EXISTENT_USER_ID + ` Id: ${id}` }));
        }
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ title: M.UNKNOWN_ERROR, message: error.message }));
    }
};

// @desc Delete a User
// @route DELETE /api/users/:id
export const removeUser = async (req: IncomingMessage, res: ServerResponse) => {
    const id = getUserId(req.url);

    if (!validateId(id)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: M.INVALID_USER_ID + ` Id: ${id}` }));

        return;
    }

    try {
        const user = await User.findById(id);

        if (user) {
            await User.remove(id);

            res.writeHead(204, { 'Content-Type': 'application/json' });
            res.end();
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: M.NON_EXISTENT_USER_ID + ` Id: ${id}` }));
        }
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ title: M.UNKNOWN_ERROR, message: error.message }));
    }
};
