import { QuizModel } from "@/_helpers/model/entities/quiz"
import { NextRequest } from "next/server"

interface IProps {
  params: { id: string }
}

export const GET = async (req: NextRequest, { params }: IProps) => {
  try {
    const quiz = await QuizModel.findByPk(params.id)

    if (!quiz) {
      return Response.json({ message: "Quiz not found" }, { status: 404 })
    }

    return Response.json({ quiz }, { status: 200 })
  } catch (err) {
    return Response.json({ message: "Server error", err }, { status: 500 })
  }
}

export const DELETE = async (req: NextRequest, { params }: IProps) => {
  try {
    const quiz = await QuizModel.findByPk(params.id)

    if (!quiz) {
      return Response.json({ message: "Quiz not found" }, { status: 404 })
    }

    await quiz.destroy()
    return Response.json({ message: "Quiz deleted successfully" })
  } catch (err) {
    return Response.json({ message: "Server error", err }, { status: 500 })
  }
}
