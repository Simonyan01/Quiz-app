export enum Role {
  USER = "user",
  ADMIN = "admin",
}

export interface IUser {
  id: number
  name: string
  surname: string
  login: string
  password: string
  role: Role
}
