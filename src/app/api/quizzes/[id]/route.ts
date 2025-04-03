import { QuizResultModel } from "@/_helpers/model/entities/quiz-result"
import { QuestionModel } from "@/_helpers/model/entities/question"
import { QuizModel } from "@/_helpers/model/entities/quiz"
import { IQuiz, QuizAnswer } from "@/_helpers/types/types"
import { NextRequest } from "next/server"

type Params = Promise<{ id: string }>

export const GET = async (req: NextRequest, context: { params: Params }) => {
  try {
    const params = await context.params
    const id = params.id
    const quiz = await QuizModel.findByPk(id, {
      include: [
        {
          model: QuestionModel,
          as: "questions",
          attributes: ["id", "question", "answers", "correctAnswer"],
        },
        {
          model: QuizResultModel,
          as: "results",
        },
      ],
    })

    if (!quiz) {
      return Response.json({ message: "Quiz not found" }, { status: 404 })
    }

    return Response.json({ quiz }, { status: 200 })
  } catch (err) {
    return Response.json({ message: "Server error", err }, { status: 500 })
  }
}

export const POST = async (req: NextRequest) => {
  try {
    const { userId, quizId, answers } = await req.json()

    if (!userId || !quizId || !answers || answers.length === 0) {
      return Response.json({ message: "Invalid data. Make sure answers are provided." }, { status: 400 })
    }

    const quiz = await QuizModel.findByPk(quizId, {
      include: [
        {
          model: QuestionModel,
          as: "questions",
          attributes: ["id", "question", "answers", "correctAnswer"],
        },
        {
          model: QuizResultModel,
          as: "results",
        },
      ],
    })

    if (!quiz) {
      return Response.json({ message: "Quiz not found" }, { status: 404 })
    }

    const quizWithQuestions = quiz as IQuiz

    const score = answers.reduce((totalScore: string, answer: QuizAnswer) => {
      const question = quizWithQuestions.questions?.find((q) => q.id === answer.id)

      if (question && question.correctAnswer === answer.selectedAnswer) {
        return totalScore + 1
      }

      return totalScore
    }, 0)

    const result = await QuizResultModel.create({
      userId,
      quizId,
      score,
      completedAt: new Date(),
    })

    return Response.json({ message: "Quiz result submitted successfully", result }, { status: 201 })
  } catch (err) {
    const errRes = err as Error
    return Response.json(
      { message: "An error occurred while submitting the quiz result.", error: errRes.message },
      { status: 500 },
    )
  }
}

export const DELETE = async (req: NextRequest, context: { params: Params }) => {
  try {
    const params = await context.params
    const id = params.id
    const quiz = await QuizModel.findByPk(id)

    if (!quiz) {
      return Response.json({ message: "Quiz not found" }, { status: 404 })
    }

    await quiz.destroy()
    return Response.json({ message: "Quiz deleted successfully" })
  } catch (err) {
    return Response.json({ message: "Server error", err }, { status: 500 })
  }
}
