export const Role = {
  USER: "user",
  ADMIN: "admin",
} as const

export type Role = (typeof Role)[keyof typeof Role]

export interface IUser {
  id: number
  name: string
  surname: string
  login: string
  password: string
  role: Role
  image: string
}

export interface IQuiz {
  id: number
  title: string
  createdBy: number
  description: string
  image: File | string | null
  questions?: IQuestion[]
}

export interface IQuestion {
  id?: number
  quizId?: number
  question: string
  answers: string[]
  correctAnswer: string
}

export type QuizAnswer = {
  id: number
  selectedAnswer: string
  isCorrect?: boolean
  correctAnswer?: string
}

export interface IQuizResult {
  id?: number
  userId: number
  quizId: number | string
  score?: number
  answers?: QuizAnswer[]
  completedAt: Date | string
}

// REST API ----------------- |

export const METHODS = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  PATCH: "PATCH",
  DELETE: "DELETE",
} as const

export type METHODS = (typeof METHODS)[keyof typeof METHODS]

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
  (url: string) => void,
]
