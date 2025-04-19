import "@/_helpers/config/associations"

import { QuestionModel } from "@/_helpers/model/entities/question"
import { QuizModel } from "@/_helpers/model/entities/quiz"
import { NextRequest } from "next/server"
import { promisify } from "util"
import crypto from "crypto"
import path from "path"
import fs from "fs"

const mkdir = promisify(fs.mkdir)
const access = promisify(fs.access)

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
      const uploadDir = path.join(process.cwd(), "public/uploads")

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

export const PATCH = async (req: NextRequest) => {
  try {
    const formData = await req.formData()
    console.log(formData)

    const id = formData.get("id") as string
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const image = formData.get("image") as File

    if (!id || !title || !description) {
      return Response.json({ message: "Missing required fields" }, { status: 400 })
    }

    const quiz = await QuizModel.findByPk(id, {
      include: [{ model: QuestionModel, as: "questions" }],
    })

    if (!quiz) {
      return Response.json({ message: "Quiz not found" }, { status: 404 })
    }

    let quizImagePath: string | null = typeof quiz.image === "string" ? quiz.image : null

    if (image && image.size > 0) {
      const uploadDir = path.join(process.cwd(), "public/uploads")

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

    await QuestionModel.destroy({ where: { quizId: quiz.id } })

    const questions: any[] = []
    let idx = 0

    while (formData.has(`questions[${idx}][question]`)) {
      const question = formData.get(`questions[${idx}][question]`) as string
      const correctAnswer = formData.get(`questions[${idx}][correctAnswer]`) as string

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
