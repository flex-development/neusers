import { IsAlphanumeric, IsEmail, IsString, MinLength } from 'class-validator'
import { Collection } from 'fireorm'
import { CONF } from '../../../config/configuration'
import Entity from '../../../lib/models/entity.model'
import repoPath from '../../../lib/utils/repoPath.util'
import { IUser } from '../interfaces/user.interface'

/**
 * @file Subdomain Model - User
 * @module app/subdomains/users/models/User
 */

@Collection(repoPath(CONF.SUBDOMAINS.users.repo))
export default class User extends Entity implements IUser {
  @IsEmail()
  email: IUser['email']

  @IsString()
  first_name: IUser['first_name']

  @IsString()
  last_name: IUser['last_name']

  @IsAlphanumeric()
  @MinLength(4)
  password: IUser['password']
}
