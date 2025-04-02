import sequelize from "@/_helpers/config/sequelize"
import { IQuestion } from "@/_helpers/types/types"
import { DataTypes, Model } from "sequelize"

class Question extends Model implements IQuestion {
  id!: number
  quizId!: number
  question!: string
  answers!: string[]
  correctAnswer!: string
}

Question.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    question: DataTypes.STRING,
    answers: DataTypes.JSON,
    correctAnswer: DataTypes.STRING,
    quizId: {
      type: DataTypes.INTEGER,
      references: {
        model: "quizzes",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    modelName: "Question",
    tableName: "questions",
    sequelize,
  },
)

export const QuestionModel = Question
