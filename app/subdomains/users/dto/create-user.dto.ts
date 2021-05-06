import type { EntityDTO } from '@flex-development/dreepo/lib/dto/entity.dto'
import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty } from 'class-validator'
import Meta from '../metadata/create-user-dto.metadata'
import type { UserEntity } from '../users.types'

/**
 * @file Users Subdomain DTO - CreateUserDTO
 * @module app/subdomains/users/dto/CreateUser
 */

export default class CreateUserDTO implements EntityDTO<UserEntity> {
  @ApiProperty(Meta.email)
  @IsEmail()
  email: UserEntity['email']

  @ApiProperty(Meta.first_name)
  @IsNotEmpty()
  first_name: UserEntity['first_name']

  @ApiProperty(Meta.last_name)
  @IsNotEmpty()
  last_name: UserEntity['last_name']

  @ApiProperty(Meta.password)
  @IsNotEmpty()
  password: UserEntity['password']
}
