import { DataTypes, Model } from "sequelize"
import sequelize from "../config/sequelize"
import { IUser, Role } from "../lib/types"

class User extends Model implements IUser {
  id!: number
  name!: string
  surname!: string
  login!: string
  password!: string
  role!: Role
  image!: string
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: DataTypes.STRING,
    surname: DataTypes.STRING,
    login: {
      type: DataTypes.STRING,
      unique: true,
    },
    password: DataTypes.STRING,
    role: {
      type: DataTypes.ENUM(...Object.values(Role)),
      defaultValue: Role.USER,
    },
    image: DataTypes.STRING,
  },
  {
    modelName: "User",
    tableName: "users",
    sequelize,
  },
)

export const UserModel = User
