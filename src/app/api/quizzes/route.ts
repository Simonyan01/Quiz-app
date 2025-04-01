import { QuestionModel } from "@/_helpers/model/entities/question"
import { QuizModel } from "@/_helpers/model/entities/quiz"
import { IQuiz } from "@/_helpers/types/types"
import { NextRequest } from "next/server"

export const GET = async () => {
  try {
    const quizzes = await QuizModel.findAll()

    return Response.json(quizzes)
  } catch {
    return Response.json({ message: "Server error" }, { status: 500 })
  }
}

export const POST = async (req: NextRequest) => {
  try {
    const { title, description, questions, createdBy }: IQuiz = await req.json()

    if (!title || !description || !questions?.length || !createdBy) {
      return Response.json({ message: "Invalid request body" }, { status: 400 })
    }

    for (const data of questions) {
      if (!data.question || !data.answers || !data.correctAnswer) {
        return Response.json({ message: "Invalid question format" }, { status: 400 })
      }
    }

    const newQuiz = await QuizModel.create({ title, description, createdBy })

    const allQuestions = questions.map(({ question, answers, correctAnswer }) => ({
      question: question,
      answers: answers,
      correctAnswer: correctAnswer,
      quizId: newQuiz.id,
    }))

    await QuestionModel.bulkCreate(allQuestions)
    return Response.json({ quiz: newQuiz, questions: allQuestions }, { status: 201 })
  } catch {
    return Response.json({ message: "Server error" }, { status: 500 })
  }
}

// export const PUT = async (req: NextRequest) => {
//   try {
//     const { id, title, description, questions } = await req.json()
//     const quiz = await QuizModel.findByPk(id)

//     if (!quiz) {
//       return Response.json({ message: "Quiz not found" }, { status: 404 })
//     }

//     await quiz.update({ title, description, questions })
//     return Response.json(quiz)
//   } catch {
//     return Response.json({ message: "Server error" }, { status: 500 })
//   }
// }
