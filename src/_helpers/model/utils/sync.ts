import sequelize from "@/_helpers/config/sequelize"

export const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true })
    console.log("Database synchronized successfully.")
  } catch (err) {
    console.error(`Database synchronization failed: ${err instanceof Error ? err.message : err}`)
  }
}
