import request from 'supertest';
import { validate } from 'uuid';

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
