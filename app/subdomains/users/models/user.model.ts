import { Entity } from '@flex-development/dreepo'
import { Email } from '../../../lib/models'
import NonEmptyString from '../../../lib/models/nes.model'
import type { UsersRepoValidatorOptsDTO } from '../users.types'
import StrongPassword from './strong-password.model'

/**
 * @file Subdomain Model - User
 * @module app/subdomains/users/User
 */

export const User = Entity.extend({
  /**
   * Unique email address for this user.
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
   */
  password: StrongPassword
})

export const UserVopts: UsersRepoValidatorOptsDTO = {
  enabled: true,
  model: User
}
