import { CreateUserService } from "@/user/create/application/create.service"
import { UserDTO } from "@/user/create/infraestructure/create.dto"
import type { Request, Response } from "express"

export class CreateUserController {
  // TODO, controlador experimental
  private createUserService: CreateUserService

  constructor(createUserService: CreateUserService) {
    this.createUserService = createUserService
  }

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const createUserDTO = new UserDTO(req.body)
      const createdUser = await this.createUserService.createUser(createUserDTO)

      res.status(201).json({
        success: true,
        message: "User created successfully",
        user: createdUser,
      })
    } catch (error) {
      console.error("Error creating user:", error)
      res.status(400).json({
        success: false,
        message: "Failed to create user",
        error: error || "Unexpected error",
      })
    }
  }
}
