export const Role = {
  USER: "user",
  ADMIN: "admin",
} as const

export type Role = (typeof Role)[keyof typeof Role]

export interface IUser {
  id: number
  name: string
  surname: string
  email: string
  login: string
  password?: string
  role: Role
  verified: boolean
  image: string | null
  achievements?: string[]
  activationToken?: string | null
}

export interface IQuiz {
  id: number
  title: string
  createdBy: number
  description: string
  image: string | File | null
  passed?: boolean
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
  passed?: boolean
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

export type METHODS = keyof typeof METHODS

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
  make: (url: string, method: METHODS, payload?: V) => Promise<void>,
  error: string,
  loading: boolean | null,
  data: T | null,
]
