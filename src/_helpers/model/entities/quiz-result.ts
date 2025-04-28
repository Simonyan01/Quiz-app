import { IQuizResult } from "@/_helpers/types/types"
import sequelize from "@/_helpers/config/sequelize"
import { DataTypes, Model } from "sequelize"
import "@/_helpers/config/associations"

class QuizResult extends Model implements IQuizResult {
  id!: number
  userId!: number
  quizId!: number
  score!: number
  passed!: boolean
  completedAt!: Date
}

QuizResult.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: DataTypes.INTEGER,
    quizId: DataTypes.INTEGER,
    score: DataTypes.INTEGER,
    completedAt: DataTypes.DATE,
    passed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    modelName: "QuizResult",
    tableName: "quiz_results",
    sequelize,
  },
)

export const QuizResultModel = QuizResult
