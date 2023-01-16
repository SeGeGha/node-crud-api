import { v4 as uuidv4 } from 'uuid';

import { IUserData, IUser } from '../types/user';

let users: IUser[] = [];

export const findAll = async (): Promise<IUser[]> => users;

export const findById = async (id: string): Promise<IUser | undefined> => users.find(user => user.id === id);

export const create = async (userData: IUserData): Promise<IUser> => {
    const user = { ...userData, id: uuidv4() };

    users.push(user);

    return user;
};

export const update = async (id: string, userData: IUserData): Promise<IUser | undefined> => {
    const index = users.findIndex(user => user.id === id);

    if (index >= 0) users[index] = { ...userData, id };

    return users[index];
};

export const remove = async (id: string): Promise<IUser[]> => {
    users = users.filter(user => user.id !== id);

    return users;
};
