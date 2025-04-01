import { QuizResultModel } from "@/_helpers/model/entities/quiz-result"
import { QuestionModel } from "@/_helpers/model/entities/question"
import { QuizModel } from "@/_helpers/model/entities/quiz"
import { UserModel } from "@/_helpers/model/entities/user"

// User <-> Quiz -------------------------------------
UserModel.hasMany(QuizModel, {
  foreignKey: "createdBy",
  as: "quizzes",
})

QuizModel.belongsTo(UserModel, {
  foreignKey: "createdBy",
  as: "creator",
})

// Quiz <-> Question ---------------------------------
QuizModel.hasMany(QuestionModel, {
  foreignKey: "quizId",
  as: "questions",
})

QuestionModel.belongsTo(QuizModel, {
  foreignKey: "quizId",
  as: "quiz",
})

// User <-> QuizResult -------------------------------
UserModel.hasMany(QuizResultModel, {
  foreignKey: "userId",
  as: "results",
})

// Quiz <-> QuizResult -------------------------------
QuizModel.hasMany(QuizResultModel, {
  foreignKey: "quizId",
  as: "results",
})

// QuizResult <-> User -------------------------------
QuizResultModel.belongsTo(UserModel, {
  foreignKey: "userId",
  as: "user",
})

// QuizResult <-> Quiz -------------------------------
QuizResultModel.belongsTo(QuizModel, {
  foreignKey: "quizId",
  as: "quiz",
})
