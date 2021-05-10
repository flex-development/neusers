import { IsUnixTimestamp } from '@flex-development/dreepo'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'
import { IsStrongPassword } from '../decorators'
import type { IUser } from '../interfaces'
import Meta from '../metadata/user.metadata'

/**
 * @file Users Subdomain Model - PartialUser
 * @module app/subdomains/users/PartialUser
 */

export default class PartialUser implements Partial<IUser> {
  @ApiPropertyOptional(Meta.created_at)
  @IsUnixTimestamp()
  created_at?: IUser['created_at']

  @ApiPropertyOptional(Meta.email)
  @IsEmail()
  email?: IUser['email']

  @ApiPropertyOptional(Meta.first_name)
  @IsString()
  @IsNotEmpty()
  first_name?: IUser['first_name']

  @ApiProperty(Meta.id)
  @IsString()
  @IsNotEmpty()
  id: IUser['id']

  @ApiPropertyOptional(Meta.last_name)
  @IsString()
  @IsNotEmpty()
  last_name?: IUser['last_name']

  @ApiPropertyOptional(Meta.password)
  @IsStrongPassword({ minSymbols: 0 })
  password?: IUser['email']

  @ApiPropertyOptional(Meta.updated_at)
  @IsUnixTimestamp()
  updated_at?: IUser['updated_at']
}
