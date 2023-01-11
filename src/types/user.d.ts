export interface IUserData {
    name: string
    age: number
    hobbies: string[]
}

export interface IUser extends IUserData{
    id: string
}
