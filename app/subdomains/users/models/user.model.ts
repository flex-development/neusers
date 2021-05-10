import { Entity, IsUnixTimestamp } from '@flex-development/dreepo'
import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'
import { IsStrongPassword } from '../decorators'
import type { IUser } from '../interfaces'
import Meta from '../metadata/user.metadata'

/**
 * @file Users Subdomain Model - User
 * @module app/subdomains/users/User
 */

export default class User extends Entity implements IUser {
  @ApiProperty(Meta.created_at)
  @IsUnixTimestamp()
  created_at: IUser['created_at']

  @ApiProperty(Meta.email)
  @IsEmail()
  email: IUser['email']

  @ApiProperty(Meta.first_name)
  @IsString()
  @IsNotEmpty()
  first_name: IUser['first_name']

  @ApiProperty(Meta.id)
  @IsString()
  @IsNotEmpty()
  id: IUser['id']

  @ApiProperty(Meta.last_name)
  @IsString()
  @IsNotEmpty()
  last_name: IUser['last_name']

  @ApiProperty(Meta.password)
  @IsStrongPassword({ minSymbols: 0 })
  password: IUser['email']

  @ApiProperty(Meta.updated_at)
  @IsUnixTimestamp()
  updated_at: IUser['updated_at']
}
