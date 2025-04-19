import "@/_helpers/config/associations"

import { QuestionModel } from "@/_helpers/model/entities/question"
import { NextRequest } from "next/server"

export const POST = async (req: NextRequest) => {
  try {
    const { id, selectedAnswer } = await req.json()
    const question = await QuestionModel.findByPk(id)

    if (!question) {
      return Response.json({ message: "Question not found" }, { status: 404 })
    }

    const isCorrect = question.correctAnswer === selectedAnswer
    const responseData = {
      isCorrect,
      correctAnswer: isCorrect ? undefined : question.correctAnswer
    }
    
    return Response.json(responseData)
  } catch (err) {
    const errRes = err as Error
    return Response.json({ message: "Server error", error: errRes.message }, { status: 500 })
  }
}
