import "@/_helpers/config/associations"

import { QuizResultModel } from "@/_helpers/model/entities/quiz-result"
import { QuestionModel } from "@/_helpers/model/entities/question"
import { QuizModel } from "@/_helpers/model/entities/quiz"
import { getUserId } from "@/_helpers/utils/getUserId"
import { NextRequest } from "next/server"
import { promisify } from "util"
import crypto from "crypto"
import path from "path"
import fs from "fs"

const mkdir = promisify(fs.mkdir)
const access = promisify(fs.access)

export const GET = async (req: NextRequest) => {
  try {
    const userId = getUserId(req)

    if (!userId) {
      return Response.json({ message: "Unauthorized user" }, { status: 401 })
    }

    const quizzes = await QuizModel.findAll({
      include: [{ model: QuestionModel, as: "questions" }],
    })

    const passedQuizzes = await Promise.all(
      quizzes.map(async (quiz) => {
        const result = await QuizResultModel.findOne({
          where: { quizId: quiz.id, userId },
        })

        const passed = result?.passed ?? false

        return {
          ...quiz.toJSON(),
          passed,
        }
      }),
    )

    return Response.json(passedQuizzes)
  } catch (err) {
    console.error(`Failed to fetch quizzes:${err}`)
    return Response.json({ message: "Server error" }, { status: 500 })
  }
}

export const POST = async (req: NextRequest) => {
  try {
    const formData = await req.formData()

    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const createdBy = formData.get("createdBy")
    const image = formData.get("image") as File

    if (!title || !description) {
      return Response.json({ message: "Missing required fields" }, { status: 400 })
    }

    let quizImagePath = null

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

    const questions: any[] = []
    let idx = 0

    while (formData.has(`questions[${idx}][question]`)) {
      const question = formData.get(`questions[${idx}][question]`) as string
      const correctAnswer = formData.get(`questions[${idx}][correctAnswer]`) as string

      const answers: string[] = []
      let answer = 0

      while (formData.has(`questions[${idx}][answers][${answer}]`)) {
        answers.push(formData.get(`questions[${idx}][answers][${answer}]`) as string)
        answer++
      }

      questions.push({
        question,
        correctAnswer,
        answers,
      })

      idx++
    }

    const newQuiz = await QuizModel.create({ title, description, image: quizImagePath, createdBy })
    const allQuestions = questions.map((q) => ({
      quizId: newQuiz.id,
      question: q.question,
      correctAnswer: q.correctAnswer,
      answers: q.answers,
    }))

    await QuestionModel.bulkCreate(allQuestions)

    return Response.json({ quiz: newQuiz }, { status: 201 })
  } catch {
    return Response.json({ message: "Failed to create quiz" }, { status: 500 })
  }
}
