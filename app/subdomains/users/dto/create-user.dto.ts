import { IsAlphanumeric, IsEmail, IsString, MinLength } from 'class-validator'
import type { IUser } from '../interfaces/user.interface'

/**
 * @file Subdomain DTO - CreateUserDTO
 * @module app/subdomains/users/dto/CreateUser
 */

export default class CreateUserDTO {
  @IsEmail()
  email: IUser['email']

  @IsString()
  first_name: IUser['first_name']

  @IsString()
  last_name: IUser['last_name']

  @IsAlphanumeric()
  @MinLength(4)
  password: IUser['password']
}
