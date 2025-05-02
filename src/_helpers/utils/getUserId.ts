import { NextRequest } from "next/server"
import jwt from "jsonwebtoken"

export const getUserId = (req: NextRequest) => {
  try {
    const token = req.cookies.get("_token")?.value
    const key = process.env.JWT_SECRET

    if (!token || !key) return null

    const decoded = jwt.verify(token, key) as { id: number }
    return decoded.id
  } catch {
    return null
  }
}
