import express from "express"
import { sequelizeSync } from "./shared/db.config"
import { CreateUserService } from "./user/create/application/create.service"
import { UserRepository } from "./user/create/domain/repositories/create.repository"
import { CreateUserController } from "./user/create/infraestructure/create.controller"

export function createApp(port: number) {
  sequelizeSync()

  const app = express()
  app.use(express.json())

  const createUserRepository = new UserRepository()
  const createUserService = new CreateUserService(createUserRepository)
  const createUserController = new CreateUserController(createUserService)

  app.post(
    "/user/create",
    createUserController.createUser.bind(createUserController),
  )

  // Iniciar el servidor
  app.listen(port, () => {
    console.log("Server is running on port", port)
  })
}
