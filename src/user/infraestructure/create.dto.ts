import { Expose } from "class-transformer"
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from "class-validator"

export enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

export class UserDTO {
  @Expose()
  @IsString({ message: "User must be a text." })
  @MinLength(3, { message: "Minimum length for user is 3 characters." })
  @MaxLength(15, { message: "Maximum length for user is 15 characters." })
  username!: string

  @Expose()
  @IsString({ message: "Password must be a text." })
  @MinLength(6, { message: "Minimum length for password is 6 characters." })
  @MaxLength(15, { message: "Maximum length for password is 15 characters." })
  password!: string

  @Expose()
  @IsEmail({}, { message: "Please provide a valid email." })
  email!: string

  @Expose()
  @IsOptional()
  @IsUrl(
    { protocols: ["http", "https"], require_protocol: true },
    { message: "Please provide a correct URL." },
  )
  avatar?: string

  @Expose()
  @IsOptional()
  bio?: string

  @Expose()
  @IsEnum(UserRole, { message: "Invalid role." })
  role!: UserRole

  constructor(partial: Partial<UserDTO>) {
    Object.assign(this, partial)
  }
}
