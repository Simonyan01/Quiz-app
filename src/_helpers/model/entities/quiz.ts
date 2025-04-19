import { IQuestion, IQuiz } from "@/_helpers/types/types"
import sequelize from "@/_helpers/config/sequelize"
import { DataTypes, Model } from "sequelize"
import "@/_helpers/config/associations"

class Quiz extends Model implements IQuiz {
  id!: number
  title!: string
  createdBy!: number
  description!: string
  image!: File | null
  questions!: IQuestion[]
}

Quiz.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: DataTypes.STRING,
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdBy: {
      type: DataTypes.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
    },
  },
  {
    modelName: "Quiz",
    tableName: "quizzes",
    sequelize,
  },
)

export const QuizModel = Quiz
