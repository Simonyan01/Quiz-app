import sequelize from "@/_helpers/config/sequelize"
import { DataTypes, Model } from "sequelize"

class QuizResult extends Model {
  id!: number
  userId!: number
  quizId!: number
  score!: number
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
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    modelName: "QuizResult",
    tableName: "quiz_results",
    sequelize,
  },
)

export const QuizResultModel = QuizResult
