import "@/_helpers/config/associations"

import { QuizResultModel } from "@/_helpers/model/entities/quiz-result"
import { UserModel } from "@/_helpers/model/entities/user"
import { getUserId } from "@/_helpers/utils/getUserId"
import { NextRequest } from "next/server"

export const GET = async (req: NextRequest) => {
  try {
    const userId = getUserId(req)
    if (!userId) {
      return Response.json({ message: "Unauthorized user" }, { status: 401 })
    }

    const user = await UserModel.findByPk(userId)
    if (!user) {
      return Response.json({ message: "User not found" }, { status: 404 })
    }

    const results = await QuizResultModel.findAll({
      where: { userId },
    })

    return Response.json(results)
  } catch {
    return Response.json({ message: "Server error" }, { status: 500 })
  }
}
