import type { IEntity } from '../../../lib/interfaces'

/**
 * @file Users Subdomain Interface - IUser
 * @module app/subdomains/users/interfaces/User
 */

export interface IUser extends IEntity {
  /**
   * Unique email address for the user.
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
   *
   * Passwords must contain at least 1 lower and uppercase letter, 1 number,
   * and be at least 8 characters.
   */
  password: string
}
