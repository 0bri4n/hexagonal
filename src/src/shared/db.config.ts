import { User } from "@/user/create/domain/models/user.entity"
import Sequelize from "@sequelize/core"

const { DB_USER, DB_PASSWORD, DB_NAME } = process.env

export const sequelize = new Sequelize({
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  host: "localhost",
  port: 5432,
  dialect: "postgres",
  logging: false,
  models: [User],
})

export const sequelizeSync = async () => {
  await sequelize
    .sync()
    .then(() => {
      console.log("Connection has been established successfully.")
    })
    .catch((err) => {
      console.error(err)
    })
}
