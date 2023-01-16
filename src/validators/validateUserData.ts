import { IUserData } from '../types/user';

import { isString, isNumber, isArray } from '../utils/typeGuards';

export const validateUserData = ({ age, username, hobbies }: IUserData) => (
    isNumber(age) &&
    isString(username) &&
    isArray(hobbies) &&
    hobbies.every(isString)
)
