import { nanoid } from "nanoid"

export const activationToken = nanoid()
export const defaultAvatar = "https://www.gravatar.com/avatar/?d=mp"
export const accountActivationLink = `${process.env.NEXT_PUBLIC_API_URL}/activate/${activationToken}`
