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
  image: string
}

export interface IResponse {
  status: string
  message: string
  payload: unknown
  user?: IUser
}

// REST API ------------ |

export enum METHODS {
  GET,
  POST,
  PUT,
  PATCH,
  DELETE,
}

export interface IQuery<T> {
  data: T
  loading: boolean
  error: string
  refetch: () => void
  setLoading: (loader: boolean) => void
  setError: (error: string) => void
  setData: (value: T) => void
}

export type Mutation<T, V = undefined> = [
  (url: string, method: METHODS, payload?: V) => void,
  error: string,
  loading: boolean | null,
  data: T,
]
