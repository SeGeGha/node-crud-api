import { v4 as uuidv4 } from 'uuid';

import { IUserData, IUser } from '../types/user';

let users: IUser[] = [];

export const findAll = async (): Promise<IUser[]> => new Promise(resolve => resolve(users));

export const findById = async (id: string): Promise<IUser | undefined> => new Promise(resolve => {
    const user = users.find(user => user.id === id);

    resolve(user);
});

export const create = async (userData: IUserData): Promise<IUser> => new Promise(resolve => {
    const user = { ...userData, id: uuidv4() };

    users.push(user);

    resolve(user);
});

export const update = async (id: string, userData: IUserData): Promise<IUser | undefined> => new Promise(resolve => {
    const index = users.findIndex(user => user.id === id);

    if (index >= 0) users[index] = { ...userData, id };

    resolve(users[index]);
});

export const remove = async (id: string): Promise<IUser[]> => new Promise(resolve => {
    users = users.filter(user => user.id !== id);

    resolve(users);
});
