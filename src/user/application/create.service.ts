import { User } from "../domain/models/user.entity"
import { UserRepository } from "../domain/repositories/create.repository"
import { UserDTO } from "../infraestructure/create.dto"

export class CreateUserService {
  private userRepository: UserRepository

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository
  }

  async createUser(userDTO: UserDTO): Promise<User | null> {
    const createdUser = await this.userRepository.createUser(userDTO)
    return createdUser
  }
}
