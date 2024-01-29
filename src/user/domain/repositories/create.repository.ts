import { validateUUID } from "@/shared/util"
import { type CreationAttributes, Op, type WhereOptions } from "@sequelize/core"
import { validate } from "class-validator"
import { UserDTO } from "../../infraestructure/create.dto"
import { User } from "../models/user.entity"

type UserWhereClause = WhereOptions & {
  [Op.or]: Array<{ username: string } | { email: string }>
  id?: { [Op.ne]: string }
}

export class UserRepository {
  async createUser(userData: Partial<User>): Promise<User> {
    // TODO: errors DTO
    const userDTO = new UserDTO(userData)
    const validationErrors = await validate(userDTO)

    if (validationErrors.length > 0) {
      const errorMessages = validationErrors.map((error) => {
        const constraints = Object.values(error.constraints || {})
        return constraints.join(", ")
      })

      throw new Error(errorMessages.join(", "))
    }

    const existsUser = await this.findExistingUser(
      userDTO.username,
      userDTO.email,
    )

    if (existsUser) throw new Error("User already exists.")

    const user = await User.create(userDTO as CreationAttributes<User>)
    return user
  }

  private async findExistingUser(
    username: string,
    email: string,
    excludeUserId?: string,
  ): Promise<User | null> {
    const whereClause: UserWhereClause = {
      [Op.or]: [{ username }, { email }],
    }

    if (excludeUserId !== undefined) {
      if (typeof excludeUserId !== "string" || !validateUUID(excludeUserId)) {
        throw new Error("Invalid user ID for exclusion.")
      }

      whereClause.id = { [Op.ne]: excludeUserId }
    }

    const existingUser = await User.findOne({ where: whereClause })
    return existingUser
  }
}
