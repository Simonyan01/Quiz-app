import { UserModel } from "@/_helpers/model/user"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

export const GET = async () => {
  try {
    const token = (await cookies()).get("_token")?.value
    if (!token) {
      return Response.json({ message: "Unauthorized: No token found" }, { status: 401 })
    }

    const key = process.env.JWT_SECRET
    if (!key) {
      return Response.json({ message: "Server error: missing secret key" }, { status: 500 })
    }

    const decoded = jwt.verify(token, key) as { id: number }
    const user = await UserModel.findByPk(decoded.id, {
      attributes: { exclude: ["password"] },
    })

    if (!user) {
      return Response.json({ message: "User not found" }, { status: 404 })
    }

    return Response.json(user)
  } catch (error) {
    const errRes = error as Error

    return Response.json(
      { message: errRes.name === "TokenExpiredError" ? "Token expired" : "Invalid token" },
      { status: 401 },
    )
  }
}
