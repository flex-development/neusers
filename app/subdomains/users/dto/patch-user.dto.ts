import type { EntityDTO } from '@flex-development/dreepo'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator'
import type { IUser } from '../interfaces'
import Meta from '../metadata/patch-user-dto.metadata'

/**
 * @file Users Subdomain DTO - PatchUserDTO
 * @module app/subdomains/users/dto/PatchUser
 */

export default class PatchUserDTO implements Partial<EntityDTO<IUser>> {
  @ApiPropertyOptional(Meta.email)
  @IsOptional()
  @IsEmail()
  email?: IUser['email']

  @ApiPropertyOptional(Meta.first_name)
  @IsOptional()
  @IsNotEmpty()
  first_name?: IUser['first_name']

  @ApiPropertyOptional(Meta.last_name)
  @IsOptional()
  @IsNotEmpty()
  last_name?: IUser['last_name']

  @ApiPropertyOptional(Meta.password)
  @IsOptional()
  @IsNotEmpty()
  password?: IUser['password']
}
