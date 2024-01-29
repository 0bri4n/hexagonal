import argon2 from "@node-rs/argon2"
import { type CreationOptional, DataTypes, Model } from "@sequelize/core"
import {
  Attribute,
  BeforeCreate,
  Default,
  NotNull,
  PrimaryKey,
  Table,
} from "@sequelize/core/decorators-legacy"

import { UserDTO, UserRole } from "../../infraestructure/create.dto"

type Argon2Options = Parameters<typeof argon2.hash>[1]

export interface UserAttributes extends UserDTO {
  id: number
}

@Table({ modelName: "User", tableName: "users" })
export class User extends Model<UserAttributes> implements UserAttributes {
  private static readonly DEFAULT_AVATAR = "..."
  private static readonly DEFAULT_BIO = "..."

  @Attribute(DataTypes.UUID)
  @PrimaryKey
  @Default(DataTypes.UUIDV4)
  declare id: number

  @Attribute(DataTypes.STRING)
  @NotNull
  declare email: string

  @Attribute(DataTypes.STRING)
  @NotNull
  declare username: string

  @Attribute(DataTypes.STRING)
  @NotNull
  declare password: string

  @Attribute(DataTypes.STRING)
  @Default(User.DEFAULT_AVATAR)
  declare avatar?: CreationOptional<string>

  @Attribute(DataTypes.STRING)
  @Default(User.DEFAULT_BIO)
  declare bio?: CreationOptional<string>

  @Attribute(DataTypes.ENUM([UserRole.ADMIN, UserRole.USER]))
  declare role: UserRole

  @BeforeCreate
  static async hashPassword(instance: User): Promise<void> {
    if (instance.password) {
      const options: Argon2Options = {
        timeCost: 4,
        memoryCost: 2 ** 16,
        parallelism: 4,
      }
      const hashedPassword = await hashPassword(instance.password, options)
      instance.password = hashedPassword
    }
  }
}

const hashPassword = async (
  password: string,
  options?: Argon2Options,
): Promise<string> => {
  const hashed = await argon2.hash(password, options)
  return hashed
}
