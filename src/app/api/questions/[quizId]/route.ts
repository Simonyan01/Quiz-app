import "@/_helpers/config/associations"

import { QuestionModel } from "@/_helpers/model/entities/question"
import { NextRequest } from "next/server"

export const GET = async (req: NextRequest) => {
  try {
    const urlParts = req.nextUrl.pathname.split("/")
    const quizId = urlParts.at(-1)

    if (!quizId) {
      return Response.json({ message: "Quiz ID is required" }, { status: 400 })
    }

    const questions = await QuestionModel.findAll({
      where: { quizId },
      attributes: { exclude: ["correctAnswer"] },
    })

    if (questions.length === 0) {
      return Response.json({ message: "No questions found for this quiz" }, { status: 404 })
    }

    return Response.json(questions, { status: 200 })
  } catch {
    return Response.json({ message: "Server error" }, { status: 500 })
  }
}
