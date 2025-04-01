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

export interface IQuestion {
  quizId?: number
  question: string
  answers: string[]
  correctAnswer: string
}

export interface IQuiz {
  id: number
  title: string
  description: string
  questions?: IQuestion[]
  createdBy: number
}

export interface IQuizResult {
  id: number
  quizId: number
  userId: number
  score: number
  answers: string[]
}

// REST API ----------------- |

export enum METHODS {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
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
  (url: string, method: METHODS, payload?: V) => Promise<void>,
  error: string,
  loading: boolean | null,
  data: T | null,
]
