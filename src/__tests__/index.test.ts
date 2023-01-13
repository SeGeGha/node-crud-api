import request from 'supertest';
import { validate, v4 } from 'uuid';

import { server } from '../server';

describe('Basic success requests check', () => {
    it('returns empty array with 200 status code after first GET \'/api/users\' request', async () => {
        const res = await request(server).get('/api/users');
        const data = JSON.parse(res.text);

        expect(res.statusCode).toBe(200);
        expect(data).toEqual([]);
    });

    let user;

    it('returns new user with 201 status code after POST \'/api/users\' request with valid user data', async () => {
        const mockUserData = {
            age: 34,
            name: 'Ivan',
            hobbies: ['sport', 'animals', 'computer games']
        };
        const res = await request(server)
            .post('/api/users')
            .send(mockUserData);

        expect(res.statusCode).toBe(201);

        user = JSON.parse(res.text);

        expect(validate(user.id)).toBeTruthy();
        expect(user).toEqual({
            id: user.id,
            ...mockUserData,
        })
    });

    it('returns user and 200 status code after GET \'/api/users/:id\' request with valid user id', async () => {
        const res = await request(server).get(`/api/users/${user.id}`);
        const data = JSON.parse(res.text);

        expect(res.statusCode).toBe(200);
        expect(data).toEqual(user);
    });

    it('returns updated user with 200 status code after PUT \'/api/users/:id\' request with valid user data', async () => {
        const age = 37;
        const res = await request(server).put(`/api/users/${user.id}`).send({
            age,
            name: user.name,
            hobbies: user.hobbies,
        });
        const data = JSON.parse(res.text);

        expect(res.statusCode).toBe(200);
        expect(data).toEqual({
            ...user,
            age,
        });
    });

    it('returns 204 status code after DELETE \'/api/users/:id\' request with valid user id', async () => {
        const res = await request(server).delete(`/api/users/${user.id}`);

        expect(res.statusCode).toBe(204);
    });

    it('returns empty array with 200 status code after GET \'/api/users\' request', async () => {
        const res = await request(server).get('/api/users');
        const data = JSON.parse(res.text);

        expect(res.statusCode).toBe(200);
        expect(data).toEqual([]);
    });
});

describe('Failed user updating check', () => {
    let user;

    it('returns new user with 201 status code after POST \'/api/users\' request with valid user data', async () => {
        const mockUserData = {
            age: 22,
            name: 'Sierge',
            hobbies: ['animals', 'computer games']
        };
        const res = await request(server)
            .post('/api/users')
            .send(mockUserData);

        expect(res.statusCode).toBe(201);

        user = JSON.parse(res.text);

        expect(validate(user.id)).toBeTruthy();
        expect(user).toEqual({
            id: user.id,
            ...mockUserData,
        })
    });

    it('returns 400 status code with error message after PUT \'/api/users/:id\' request with invalid user name', async () => {
        const invalidName = ['Daniil'];
        const res = await request(server).put(`/api/users/${user.id}`).send({
            age: user.age,
            name: invalidName,
            hobbies: user.hobbies,
        });

        expect(res.statusCode).toBe(400);
        expect(JSON.parse(res.text)).toHaveProperty('message', expect.any(String));
    });

    it('returns unchanged user after GET \'/api/users/:id\' request', async () => {
        const res = await request(server).get(`/api/users/${user.id}`);
        const data = JSON.parse(res.text);

        expect(res.statusCode).toBe(200);
        expect(data).toEqual(user);
    });
});

describe('Failed double deletion of user check', () => {
    let user;

    it('returns new user with 201 status code after POST \'/api/users\' request with valid user data', async () => {
        const mockUserData = {
            age: 15,
            name: 'Pavel',
            hobbies: ['anime', 'books']
        };
        const res = await request(server)
            .post('/api/users')
            .send(mockUserData);

        expect(res.statusCode).toBe(201);

        user = JSON.parse(res.text);

        expect(validate(user.id)).toBeTruthy();
        expect(user).toEqual({
            id: user.id,
            ...mockUserData,
        })
    });

    it('returns 204 status code after DELETE \'/api/users/:id\' request with valid user id', async () => {
        const res = await request(server).delete(`/api/users/${user.id}`);

        expect(res.statusCode).toBe(204);
    });

    it('returns 404 status code with error message after second DELETE \'/api/users/:id\' request', async () => {
        const res = await request(server).delete(`/api/users/${user.id}`);

        expect(res.statusCode).toBe(404);
        expect(JSON.parse(res.text)).toHaveProperty('message', expect.any(String));
    });
});

describe('Invalid user id (not uuid) check', () => {
    const methods = ['get', 'put', 'delete'];
    const mockUserId = 'id94-c2';

    methods.forEach(method => {
        it(`returns 400 status code with error message after ${method.toUpperCase()} '/api/users/:id' request`, async () => {
            const res = await request(server)[method](`/api/users/${mockUserId}`);

            expect(res.statusCode).toBe(400);
            expect(JSON.parse(res.text)).toHaveProperty('message', expect.any(String));
        });
    });
});

describe('Invalid user id (uuid) check', () => {
    const methods = ['get', 'put', 'delete'];
    const mockUserId = v4();

    methods.forEach(method => {
        it(`returns 404 status code with error message after ${method.toUpperCase()} '/api/users/:id' request with invalid user id (uuid)`, async () => {
            const res = await request(server)[method](`/api/users/${mockUserId}`);

            expect(res.statusCode).toBe(404);
            expect(JSON.parse(res.text)).toHaveProperty('message', expect.any(String));
        });
    });
});

describe('Invalid user data in req.body check', () => {
    it('returns 400 status code after POST \'/api/users\' request', async () => {
        const mockInvalidUsersData = [
            {
                name: 'Philip',
                hobbies: [],
            },
            {
                age: 19,
                hobbies: [],
            },
            {
                age: 19,
                name: 'Philip',
                hobbies: 'sport',
            },
            {
                age: '19',
                name: 'Philip',
                hobbies: [],
            },
            {
                age: 19,
                name: Symbol('Philip'),
                hobbies: [],
            },
            {
                age: 'Philip',
                name: 19,
                hobbies: [],
            }
        ];
        const mockStatusCodeList = new Array(mockInvalidUsersData.length).fill(400);
        const requester = request(server);
        const results = await Promise.all(mockInvalidUsersData.map(userData => requester.post('/api/users').send(userData)));
        const statusCodeList = results.map(result => result.statusCode)

        expect(statusCodeList).toEqual(mockStatusCodeList);
    });
});

describe('Invalid route check', () => {
    const methods = ['get', 'post', 'put', 'delete'];

    methods.forEach(method => {
        it(`returns 404 status code with error message after ${method.toUpperCase()} request with invalid route`, async () => {
            const invalidRoute = '/api/users/blogs/post';
            const res = await request(server)[method](invalidRoute);

            expect(res.statusCode).toBe(404);
            expect(JSON.parse(res.text)).toHaveProperty('message', expect.any(String));
        });
    });
});
