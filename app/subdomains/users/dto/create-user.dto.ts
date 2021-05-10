import type { EntityDTO } from '@flex-development/dreepo'
import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty } from 'class-validator'
import type { IUser } from '../interfaces'
import Meta from '../metadata/create-user-dto.metadata'

/**
 * @file Users Subdomain DTO - CreateUserDTO
 * @module app/subdomains/users/dto/CreateUser
 */

export default class CreateUserDTO implements EntityDTO<IUser> {
  @ApiProperty(Meta.email)
  @IsEmail()
  email: IUser['email']

  @ApiProperty(Meta.first_name)
  @IsNotEmpty()
  first_name: IUser['first_name']

  @ApiProperty(Meta.last_name)
  @IsNotEmpty()
  last_name: IUser['last_name']

  @ApiProperty(Meta.password)
  @IsNotEmpty()
  password: IUser['password']
}
