import type { IEntity } from '../../../lib/interfaces'

/**
 * @file Subdomain Inteface - IUser
 * @module app/subdomains/users/interfaces/User
 */

export interface IUser extends IEntity {
  /**
   * Unique email address for this user.
   * Attempting to assign the same email to multiple users returns an error.
   */
  email: string

  /**
   * User's first name.
   */
  first_name: string

  /**
   * User's first name.
   */
  last_name: string

  /**
   * Hashed password.
   */
  password: string
}
