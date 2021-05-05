import { ExceptionStatusCode } from '@flex-development/exceptions/enums'
import Exception from '@flex-development/exceptions/exceptions/base.exception'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { compareSync } from 'bcryptjs'
import omit from 'lodash.omit'
import type { EnvironmentVariables } from '../../../lib/interfaces'
import type { BasicAuthDecoded, UserEntity as User } from '../users.types'
import UsersService from './users.service'

/**
 * @file Subdomain Providers - AuthService
 * @module app/subdomains/users/providers/AuthService
 */

@Injectable()
export default class AuthService {
  constructor(
    readonly config: ConfigService<EnvironmentVariables>,
    readonly users: UsersService
  ) {}

  /**
   * Decodes a Basic Authorization header.
   *
   * @param {string} [authorization] - Authorization header
   * @return {BasicAuthDecoded} Object representing decoded header
   * @throws {Exception}
   */
  decodeBasicAuth(authorization: string = ''): BasicAuthDecoded {
    try {
      // Get credentials string from header
      const credentials = authorization.split('Basic ')[1] || ''

      // Create buffer from Base64 encoding and stringify
      const decoded = Buffer.from(credentials, 'base64').toString()

      // Get email address and password
      const { 0: email = '', 1: password = '' } = decoded.split(':')

      return { email, password }
    } catch ({ message, stack }) {
      const code = ExceptionStatusCode.INTERNAL_SERVER_ERROR
      const data = { authorization }

      throw new Exception(code, message, data, stack)
    }
  }

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
      let match = compareSync(password, user.password)

      // If comparison fails, check if passwords are equal
      // ! Needed for envs where password hashing is disabled / mocked
      if (!this.config.get<boolean>('PROD')) match = password === user.password

      if (!match) throw new Error('Incorrect password')
    } catch (error) {
      const code = ExceptionStatusCode.UNAUTHORIZED
      const data = { email, errors: { password } }

      throw new Exception(code, error.message, data)
    }

    return omit(user, ['password'])
  }
}
