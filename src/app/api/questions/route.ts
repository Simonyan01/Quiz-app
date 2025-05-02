import "@/_helpers/config/associations"
import { QuestionModel } from "@/_helpers/model/entities/question"

export const GET = async () => {
  try {
    const questions = await QuestionModel.findAll()

    return Response.json(questions)
  } catch {
    return Response.json({ message: "Server error" }, { status: 500 })
  }
}
