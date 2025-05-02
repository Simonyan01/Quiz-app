import { IUser, Role } from "@/_helpers/types/types"
import sequelize from "@/_helpers/config/sequelize"
import { DataTypes, Model } from "sequelize"
import "@/_helpers/config/associations"

class User extends Model implements IUser {
  id!: number
  name!: string
  surname!: string
  email!: string
  login!: string
  password!: string
  role!: Role
  image!: string
  verified!: boolean
  achievements!: string[]
  activationToken!: string | null
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
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
      },
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    activationToken: DataTypes.STRING,
    achievements: DataTypes.JSON,
    login: DataTypes.STRING,
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
