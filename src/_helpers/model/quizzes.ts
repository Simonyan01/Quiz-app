// import { DataTypes, Model } from "sequelize"
// import sequelize from "../config/sequelize"
// import { ISession } from "../lib/types"

// class Session extends Model<ISession> implements ISession {
//   id!: number
//   userId!: number
//   isBlocked!: boolean
//   attempts!: number
//   createdAt!: Date
//   updatedAt!: Date
// }

// Session.init(
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//     },
//     userId: {
//       type: DataTypes.INTEGER,
//     },
//     isBlocked: {
//       type: DataTypes.BOOLEAN,
//       defaultValue: false,
//     },
//     attempts: {
//       type: DataTypes.INTEGER,
//       defaultValue: 0,
//     },
//     createdAt: {
//       type: DataTypes.DATE,
//       defaultValue: DataTypes.NOW,
//     },
//     updatedAt: {
//       type: DataTypes.DATE,
//       defaultValue: DataTypes.NOW,
//     },
//   },
//   {
//     modelName: "Session",
//     tableName: "session",
//     sequelize,
//     timestamps: true,
//   },
// )

// export const SessionModel = Session
