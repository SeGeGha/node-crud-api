import { validate } from 'uuid';

import * as User from '../models/userModel';

import { getReqBody } from '../utils/getReqBody';

// @desc Gets All Users
// @route GET /api/users
export const getUsers = async (res) => {
    try {
        const users = await User.findAll();

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(users));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Something went wrong', error }));
    }
};

// @desc Gets Single User
// @route GET /api/users/:id
export const getUser = async (req, res) => {
    const id = req.url.split('/').at(-1);

    if (!validate(id)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: `User id ${id} is not valid` }));

        return;
    }

    try {
        const user = await User.findById(id);

        if (user) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(user));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: `User with id ${id} doesn\'t exist` }));
        }
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Something went wrong', error }));
    }
};

// @desc Create a User
// @route POST /api/users
export const createUser = async (req, res) => {
    try {
        const body = await getReqBody(req);
        const { age, name, hobbies = [] } = JSON.parse(body);
        const userData = { age, name, hobbies };
        const newUser = await User.create(userData);

        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(newUser));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Something went wrong', error }));
    }
};

// @desc Update a User
// @route PUT /api/users/:id
export const updateUser = async (req, res) => {
    const id = req.url.split('/').at(-1);

    if (!validate(id)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: `User id ${id} is not valid` }));

        return;
    }

    try {
        const user = await User.findById(id);

        if (user) {
            const body = await getReqBody(req);
            const { age, name, hobbies } = JSON.parse(body);
            const userData = {
                age: age || user.age,
                name: name || user.name,
                hobbies: hobbies || user.hobbies,
            };
            const updatedUser = await User.update(id, userData);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(updatedUser));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: `User with id ${id} doesn\'t exist` }));
        }
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Something went wrong', error }));
    }
};

// @desc Delete a User
// @route DELETE /api/users/:id
export const removeUser = async (req, res) => {
    const id = req.url.split('/').at(-1);

    if (!validate(id)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: `User id ${id} is not valid` }));

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
            res.end(JSON.stringify({ message: `User with id ${id} doesn\'t exist` }));
        }
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Something went wrong', error }));
    }
};
