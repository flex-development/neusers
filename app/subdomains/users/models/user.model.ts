import { Entity as EntityModel } from '@flex-development/dreepo'
import { ApiProperty } from '@nestjs/swagger'
import {
  IsAlphanumeric,
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength
} from 'class-validator'
import Email from '../../../lib/models/email.model'
import Entity from '../../../lib/models/entity.model'
import NonEmptyString from '../../../lib/models/nes.model'
import type { IUser } from '../interfaces/user.interface'
import Meta from '../metadata/user.metadata'
import type { UsersRepoValidatorOptsDTO } from '../users.types'
import StrongPassword from './strong-password.model'

/**
 * @file Users Subdomain Model - User
 * @module app/subdomains/users/User
 */

export default class User extends Entity implements IUser {
  @ApiProperty(Meta.email)
  @IsEmail()
  email: IUser['email']

  @ApiProperty(Meta.first_name)
  @IsString()
  @IsNotEmpty()
  first_name: IUser['first_name']

  @ApiProperty(Meta.last_name)
  @IsString()
  @IsNotEmpty()
  last_name: IUser['last_name']

  @ApiProperty(Meta.password)
  @IsAlphanumeric()
  @IsNotEmpty()
  @MinLength(8)
  password: IUser['email']
}

export const UserEntityModel = EntityModel.extend({
  /**
   * Unique email address for the user.
   * Attempting to assign the same email to multiple users returns an error.
   */
  email: Email,

  /**
   * User's first name.
   */
  first_name: NonEmptyString,

  /**
   * User's last name.
   */
  last_name: NonEmptyString,

  /**
   * Hashed password.
   *
   * Passwords must contain at least 1 lower and uppercase letter, 1 number,
   * and be at least 8 characters.
   */
  password: StrongPassword
})

export const UserVopts: UsersRepoValidatorOptsDTO = {
  enabled: true,
  model: UserEntityModel
}
