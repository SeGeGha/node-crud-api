export interface IUserData {
    username: string
    age: number
    hobbies: string[]
}

export interface IUser extends IUserData{
    id: string
}
