import "@/_helpers/config/associations"

import { UserModel } from "@/_helpers/model/entities/user"
import { syncDatabase } from "@/_helpers/model/sync"
import { NextRequest } from "next/server"
import jwt from "jsonwebtoken"

export const GET = async (req: NextRequest) => {
  try {
    const token = req.cookies.get("_token")?.value

    if (!token) {
      return Response.json({ message: "Unauthorized: No token found" }, { status: 401 })
    }

    const key = process.env.JWT_SECRET

    if (!key) {
      return Response.json({ message: "Server error: missing secret key" }, { status: 500 })
    }

    const decoded = jwt.verify(token, key) as { id: number }
    const user = await UserModel.findByPk(decoded.id, {
      attributes: ["id", "name", "surname", "role", "image"],
    })

    if (!user) {
      return Response.json({ message: "User not found" }, { status: 404 })
    }

    // await syncDatabase()
    return Response.json(user)
  } catch (err) {
    const errRes = err as Error

    if (errRes.name === "TokenExpiredError") {
      return Response.json({ message: "Unauthorized: Token expired" }, { status: 401 })
    } else if (errRes.name === "JsonWebTokenError") {
      return Response.json({ message: "Unauthorized: Invalid token" }, { status: 401 })
    }

    return Response.json({ message: "Server error" }, { status: 500 })
  }
}
