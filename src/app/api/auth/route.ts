import "@/_helpers/config/associations"

import { UserModel } from "@/_helpers/model/entities/user"
import { getUserId } from "@/_helpers/utils/getUserId"
import { syncDatabase } from "@/_helpers/model/sync"
import { NextRequest } from "next/server"

export const GET = async (req: NextRequest) => {
  try {
    const userId = getUserId(req)

    if (!userId) {
      return Response.json({ message: "Unauthorized user" }, { status: 401 })
    }

    if (typeof userId !== "number") {
      return Response.json({ message: "Invalid user ID" }, { status: 400 })
    }

    const user = await UserModel.findByPk(userId, {
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
