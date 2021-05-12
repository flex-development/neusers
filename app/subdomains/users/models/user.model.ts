import { Entity, IsUnixTimestamp } from '@flex-development/dreepo'
import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'
import { IsStrongPassword } from '../decorators'
import type { IUser } from '../interfaces'

/**
 * @file Users Subdomain Model - User
 * @module app/subdomains/users/User
 */

export default class User extends Entity implements IUser {
  @IsUnixTimestamp()
  @ApiProperty({
    description: 'Date and time entity was created',
    type: 'number'
  })
  created_at: IUser['created_at']

  @IsEmail()
  @ApiProperty({
    description:
      'Unique email address for the user. Attempting to assign the same email to multiple users returns an error',
    format: 'email',
    type: 'string'
  })
  email: IUser['email']

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "User's first name",
    minLength: 1,
    type: 'string'
  })
  first_name: IUser['first_name']

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Unique identifier for the user',
    type: 'string'
  })
  id: IUser['id']

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "User's last name",
    minLength: 1,
    type: 'string'
  })
  last_name: IUser['last_name']

  @IsStrongPassword({ minSymbols: 0 })
  @ApiProperty({
    description:
      'Hashed password. Passwords must contain at least 1 lower and uppercase letter, 1 number, and be at least 8 characters',
    minLength: 8,
    type: 'string'
  })
  password: IUser['email']

  @IsUnixTimestamp()
  @ApiProperty({
    description: 'Date and time entity was last modified',
    type: 'number'
  })
  updated_at: IUser['updated_at']
}
