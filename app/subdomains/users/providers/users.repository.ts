import { Repository } from '@flex-development/dreepo'
import type { OrNever, PartialOr } from '@flex-development/dreepo/lib/types'
import { ExceptionStatusCode } from '@flex-development/exceptions/enums'
import Exception from '@flex-development/exceptions/exceptions/base.exception'
import type { OnModuleInit } from '@nestjs/common'
import { Injectable } from '@nestjs/common'
import { hashSync } from 'bcryptjs'
import { CONF } from '../../../config/configuration'
import repoPath from '../../../lib/utils/repoPath.util'
import type { CreateUserDTO } from '../dto/create-user.dto'
import type { PatchUserDTO } from '../dto/patch-user.dto'
import { UserVopts } from '../models/user.model'
import type { UserEntity as User, UserQuery as Query } from '../users.types'

/**
 * @file Subdomain Providers - UsersRepository
 * @module app/subdomains/users/providers/UsersRepository
 */

@Injectable()
export class UsersRepository
  extends Repository<User, Query>
  implements OnModuleInit {
  constructor() {
    super(repoPath(CONF.SUBDOMAINS.users.repo), UserVopts)
  }

  /**
   * Initializes the repository cache.
   *
   * @return {Promise<void>} Empty promise when initialization is complete
   */
  async onModuleInit(): Promise<void> {
    await this.refreshCache()
    return
  }

  /**
   * Creates a new user.
   *
   * Throws a `409 CONFLICT` error if a user with the email {@param dto.email}
   * or id {@param dto.id} already exists.
   *
   * @async
   * @param {CreateUserDTO} dto - Data to create new user
   * @param {string} dto.email - User's email address
   * @param {string} dto.first_name - User's first name
   * @param {string} dto.last_name - User's last name
   * @param {string} dto.password - Alphanumeric password, at least 8 characters
   * @return {Promise<User>} Promise containing new user
   * @throws {Exception}
   */
  async create(dto: CreateUserDTO): OrNever<Promise<User>> {
    // Check if user with same email address already exists
    this.findOneByEmail(dto.email || '', {}, false)

    try {
      // Hash user's password (if missing, Exception will be thrown)
      if (typeof dto.password === 'string' && !!dto.password.trim().length) {
        dto.password = hashSync(dto.password, 10)
      }
    } catch (error) {
      const status = ExceptionStatusCode.INTERNAL_SERVER_ERROR
      throw new Exception(status, error.message, dto)
    }

    return await super.create(dto)
  }

  /**
   * Find a user by email address.
   *
   * @async
   * @param {string} [email] - Email address of user to find
   * @param {Query} [params] - Users repository query parameters
   * @param {boolean} [exists] - If `true`, throw error if user does exist;
   * othwerwise throw error if user exists
   * @return {PartialOr<User> | null} User or null
   * @throws {Exception}
   */
  findOneByEmail(
    email: User['email'] = '',
    params: Query = {},
    exists: boolean = true
  ): PartialOr<User> | null {
    const users = this.find({ ...params, email })
    const user = users[0] && users[0]?.email === email ? users[0] : null

    if (!user && exists) {
      const data = { errors: { email }, exists, params }
      const message = `User with email "${email}" does not exist`

      throw new Exception(ExceptionStatusCode.NOT_FOUND, message, data)
    }

    if (user && !exists) {
      const message = `User with email "${email}" already exists`
      const data = { errors: { email }, exists, params }

      throw new Exception(ExceptionStatusCode.CONFLICT, message, data)
    }

    return user
  }

  /**
   * Partially updates a user.
   *
   * The user's `created_at` and `id` properties cannot be patched.
   *
   * Throws a `409 CONFLICT` error if a user with the email {@param dto.email}
   * already exists. Throws a `404 NOT_FOUND` error if the user isn't found.
   *
   * @async
   * @param {string} id - ID of user to update
   * @param {PatchUserDTO} dto - Data to patch entity
   * @param {string[]} [rfields] - Additional readonly fields
   * @return {Promise<User>} Promise containing updated user
   * @throws {Exception}
   */
  async patch(
    id: User['id'],
    dto: PatchUserDTO,
    rfields: string[] = []
  ): OrNever<Promise<User>> {
    // If valid email, check if user with same email address already exists
    if (typeof dto?.email === 'string') {
      this.findOneByEmail(dto.email, {}, false)
    }

    // Update user's password
    if (typeof dto?.password === 'string' && dto.password.trim().length) {
      try {
        dto.password = hashSync(dto.password, 10)
      } catch (error) {
        const status = ExceptionStatusCode.INTERNAL_SERVER_ERROR
        throw new Exception(status, error.message, dto)
      }
    }

    return super.patch(id, dto, rfields)
  }
}

export default UsersRepository
