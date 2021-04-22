import {
  IsAlphanumeric,
  IsEmail,
  IsOptional,
  IsString,
  MinLength
} from 'class-validator'
import type { IUser } from '../interfaces/user.interface'

/**
 * @file Subdomain DTO - PatchUserDTO
 * @module app/subdomains/users/dto/PatchUser
 */

export default class PatchUserDTO {
  @IsEmail()
  @IsOptional()
  email?: IUser['email']

  @IsString()
  @IsOptional()
  first_name?: IUser['first_name']

  @IsString()
  @IsOptional()
  last_name?: IUser['last_name']

  @IsAlphanumeric()
  @MinLength(4)
  @IsOptional()
  password?: IUser['password']
}
