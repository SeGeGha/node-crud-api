import { IUser } from '../types/user';

import { isString, isNumber, isArray } from '../utils/typeGuards';

export const validateUserData = ({ age, name, hobbies }: Omit<IUser, 'id'>) => (
    isNumber(age) &&
    isString(name) &&
    isArray(hobbies) &&
    hobbies.every(isString)
)
