import "@/_helpers/config/associations"

import { QuizResultModel } from "@/_helpers/model/entities/quiz-result"
import { QuestionModel } from "@/_helpers/model/entities/question"
import { QuizModel } from "@/_helpers/model/entities/quiz"
import { QuizAnswer } from "@/_helpers/types/types"
import { NextRequest } from "next/server"
import { promisify } from "util"
import crypto from "crypto"
import path from "path"
import fs from "fs"

const mkdir = promisify(fs.mkdir)
const access = promisify(fs.access)

type Params = Promise<{ id: string }>

export const GET = async (_req: NextRequest, context: { params: Params }) => {
  try {
    const params = await context.params
    const quiz = await QuizModel.findByPk(params.id, {
      include: [
        {
          model: QuestionModel,
          as: "questions",
        },
      ],
    })

    if (!quiz) {
      return Response.json({ message: "Quiz not found" }, { status: 404 })
    }

    return Response.json(quiz, { status: 200 })
  } catch (err) {
    const error = err as Error
    return Response.json({ message: "Failed to fetch quiz", error: error.message }, { status: 500 })
  }
}

export const POST = async (req: NextRequest) => {
  try {
    const { userId, quizId, answers, completedAt } = await req.json()

    if (!userId || !quizId || !answers || answers.length === 0) {
      return Response.json({ message: "Invalid data. Make sure answers are provided." }, { status: 400 })
    }

    const quiz = await QuizModel.findByPk(quizId, {
      include: [
        {
          model: QuestionModel,
          as: "questions",
        },
      ],
    })

    if (!quiz) {
      return Response.json({ message: "Quiz not found" }, { status: 404 })
    }

    let score = 0
    const correctAnswers: QuizAnswer[] = []

    for (const answer of answers) {
      const question = quiz.questions.find((q) => q.id === answer.id)

      if (question && question.correctAnswer === answer.selectedAnswer) {
        score++
        correctAnswers.push({
          id: answer.id,
          selectedAnswer: answer.selectedAnswer,
        })
      }
    }

    const result = await QuizResultModel.create({
      userId,
      quizId,
      score,
      completedAt: completedAt || new Date(),
    })

    return Response.json(
      {
        message: "Quiz result submitted successfully",
        result: {
          score,
          totalQuestions: quiz.questions.length,
          correctAnswers,
          completedAt: result.completedAt,
        },
      },
      { status: 201 },
    )
  } catch (err) {
    const errRes = err as Error
    return Response.json(
      { message: "An error occurred while submitting the quiz result.", error: errRes.message },
      { status: 500 },
    )
  }
}

export const PUT = async (req: NextRequest, context: { params: Params }) => {
  try {
    const formData = await req.formData()
    const params = await context.params

    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const image = formData.get("image") as File

    if (!title || !description || !image) {
      return Response.json({ message: "Missing required fields" }, { status: 400 })
    }

    const quiz = await QuizModel.findByPk(params.id, {
      include: [{ model: QuestionModel, as: "questions" }],
    })

    if (!quiz) {
      return Response.json({ message: "Quiz not found" }, { status: 404 })
    }

    let quizImagePath = quiz.image as string | null

    if (image && image.size > 0) {
      const uploadDir = path.join(process.cwd(), "public/uploads/quizzes")

      try {
        await access(uploadDir)
      } catch {
        await mkdir(uploadDir, { recursive: true })
      }

      const buffer = Buffer.from(await image.arrayBuffer())
      const hash = crypto.createHash("sha256").update(buffer).digest("hex").slice(0, 14)
      const ext = path.extname(image.name)
      const fileName = `${hash}${ext}`
      const filePath = path.join(uploadDir, fileName)

      await fs.promises.writeFile(filePath, buffer)
      quizImagePath = fileName
    }

    quiz.title = title
    quiz.description = description
    quiz.image = quizImagePath as File | null
    await quiz.save()

    // await QuestionModel.destroy({ where: { quizId: quiz.id } })

    const questions: any[] = []
    let idx = 0

    while (formData.has(`questions[${idx}][question]`)) {
      const question = formData.get(`questions[${idx}][question]`)
      const correctAnswer = formData.get(`questions[${idx}][correctAnswer]`)

      const answers: string[] = []
      let aIdx = 0

      while (formData.has(`questions[${idx}][answers][${aIdx}]`)) {
        answers.push(formData.get(`questions[${idx}][answers][${aIdx}]`) as string)
        aIdx++
      }

      questions.push({
        quizId: quiz.id,
        question,
        correctAnswer,
        answers,
      })

      idx++
    }

    await QuestionModel.bulkCreate(questions)

    return Response.json({ message: "Quiz updated successfully" }, { status: 200 })
  } catch (err) {
    const error = err as Error
    return Response.json({ message: "Failed to update quiz", error: error.message }, { status: 500 })
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
    const errRes = err as Error
    return Response.json({ message: "Server error", error: errRes.message }, { status: 500 })
  }
}
