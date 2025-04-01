import sequelize from "@/_helpers/config/sequelize"
import { IQuiz } from "@/_helpers/types/types"
import { DataTypes, Model } from "sequelize"

class Quiz extends Model implements IQuiz {
  id!: number
  title!: string
  createdBy!: number
  description!: string
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
    createdBy: {
      type: DataTypes.INTEGER,
      references: {
        model: "users",
        key: "id",
      },
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    modelName: "Quiz",
    tableName: "quizzes",
    sequelize,
  },
)

export const QuizModel = Quiz
