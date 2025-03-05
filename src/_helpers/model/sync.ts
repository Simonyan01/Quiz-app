import sequelize from "../config/sequelize"

;(async () => {
  await sequelize.sync()
})()
