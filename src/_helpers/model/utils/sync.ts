import sequelize from "@/_helpers/config/sequelize"
import "@/_helpers/config/associations"

export const syncDatabase = async () => {
  try {
    await sequelize.sync()
    console.log("Database synchronized successfully.")
  } catch (err) {
    console.error(`Database synchronization failed: ${err instanceof Error ? err.message : err}`)
  }
}
