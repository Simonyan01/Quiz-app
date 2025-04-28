import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET!
const REFRESH_SECRET = process.env.REFRESH_SECRET!

export const generateTokens = (payload: object) => {
  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" })
  const refreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: "7d" })

  return { accessToken, refreshToken }
}

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET)
}

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, REFRESH_SECRET)
}
