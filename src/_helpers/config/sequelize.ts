import { Sequelize } from "sequelize"

const sequelize = new Sequelize({
  host: process.env.HOST,
  username: process.env.USERNAME,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  dialect: "mysql",
  dialectModule: require("mysql2"),
})

export default sequelize
