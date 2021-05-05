import { ExceptionStatusCode } from '@flex-development/exceptions/enums'
import Exception from '@flex-development/exceptions/exceptions/base.exception'
import { Injectable } from '@nestjs/common'
import { compareSync } from 'bcryptjs'
import omit from 'lodash.omit'
import UsersService from '../../users/providers/users.service'
import type { UserEntity as User } from '../../users/users.types'

/**
 * @file Subdomain Providers - AuthService
 * @module app/subdomains/auth/providers/AuthService
 */

@Injectable()
export default class AuthService {
  constructor(readonly users: UsersService) {}

  /**
   * Logs in a user using an email and password.
   *
   * Throws a `404 NOT_FOUND` error if the user with the email {@param email}
   * isn't found. Throws a `401 UNAUTHORIZED` error if the login fails.
   *
   * @async
   * @param {string} email - User's email address
   * @param {string} password - User's password
   * @return {Promise<Partial<User>>} User data (without password)
   * @throws {Exception}
   */
  async login(
    email: User['email'],
    password: User['password']
  ): Promise<Partial<User>> {
    // Check if user exists
    const user = (await this.users.findOne(email)) as User

    try {
      // Compare passwords
      const match = compareSync(password, user.password)
      if (!match) throw new Error('Incorrect password')
    } catch (error) {
      const code = ExceptionStatusCode.UNAUTHORIZED
      const data = { email, errors: { password } }

      throw new Exception(code, error.message, data)
    }

    return omit(user, ['password'])
  }
}
