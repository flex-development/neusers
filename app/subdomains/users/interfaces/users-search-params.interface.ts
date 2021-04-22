import type { SearchParams } from '../../../lib/interfaces'
import type { IUser } from './user.interface'

/**
 * @file Subdomain Interfaces - UserSearchParams
 * @module app/subdomains/users/interfaces/UserSearchParams
 */

export interface UsersSearchParams extends SearchParams {
  /**
   * Find user by email.
   */
  email?: IUser['email']

  /**
   * Filter users by first name.
   */
  first_name?: IUser['first_name']

  /**
   * Filter users by last name.
   */
  last_name?: IUser['last_name']
}
