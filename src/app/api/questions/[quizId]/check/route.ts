import { QuestionModel } from "@/_helpers/model/entities/question"
import { NextRequest } from "next/server"

export const POST = async (req: NextRequest) => {
  try {
    const { id, selectedAnswer } = await req.json()
    const question = await QuestionModel.findByPk(id)

    if (!question) {
      return Response.json({ message: "Question not found" }, { status: 404 })
    }

    return Response.json({ isCorrect: question.correctAnswer === selectedAnswer })
  } catch (err) {
    const errRes = err as Error
    return Response.json({ message: "Server error", error: errRes.message }, { status: 500 })
  }
}
