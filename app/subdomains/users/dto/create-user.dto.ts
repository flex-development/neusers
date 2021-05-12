import type { EntityDTO } from '@flex-development/dreepo'
import { ApiPropertyOptional, OmitType } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'
import type { IUser } from '../interfaces'
import User from '../models/user.model'

/**
 * @file Users Subdomain DTO - CreateUserDTO
 * @module app/subdomains/users/dto/CreateUser
 * @see https://docs.nestjs.com/openapi/mapped-types#omit
 */

export default class CreateUserDTO
  extends OmitType(User, ['created_at', 'id', 'updated_at'] as const)
  implements EntityDTO<IUser> {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiPropertyOptional({
    description: 'Unique identifier for the user',
    type: 'string'
  })
  id?: IUser['id']
}
