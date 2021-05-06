import type { EntityDTO } from '@flex-development/dreepo/lib/dto/entity.dto'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator'
import Meta from '../metadata/patch-user-dto.metadata'
import type { UserEntity } from '../users.types'

/**
 * @file Users Subdomain DTO - PatchUserDTO
 * @module app/subdomains/users/dto/PatchUser
 */

export default class PatchUserDTO implements Partial<EntityDTO<UserEntity>> {
  @ApiPropertyOptional(Meta.email)
  @IsOptional()
  @IsEmail()
  email?: UserEntity['email']

  @ApiPropertyOptional(Meta.first_name)
  @IsOptional()
  @IsNotEmpty()
  first_name?: UserEntity['first_name']

  @ApiPropertyOptional(Meta.last_name)
  @IsOptional()
  @IsNotEmpty()
  last_name?: UserEntity['last_name']

  @ApiPropertyOptional(Meta.password)
  @IsOptional()
  @IsNotEmpty()
  password?: UserEntity['password']
}
