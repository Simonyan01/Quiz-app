import { NextRequest } from "next/server"
import jwt from "jsonwebtoken"

export const getUserId = (req: NextRequest): number | null => {
  try {
    const token = req.cookies.get("_token")?.value
    if (!token) return null

    const secret = process.env.JWT_SECRET
    if (!secret) throw new Error("Missing JWT_SECRET")

    const decoded = jwt.verify(token, secret) as { id: number }
    return decoded.id
  } catch {
    return null
  }
}
