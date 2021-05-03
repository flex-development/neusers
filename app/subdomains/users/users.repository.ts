import { Repository } from '@flex-development/dreepo'
import type { OrNever, PartialOr } from '@flex-development/dreepo/lib/types'
import { ExceptionStatusCode } from '@flex-development/exceptions/enums'
import { hash } from 'bcryptjs'
import { CONF } from '../../config/configuration'
import AppException from '../../lib/exceptions/app.exception'
import repoPath from '../../lib/utils/repoPath.util'
import type { CreateUserDTO } from './dto/create-user.dto'
import type { PatchUserDTO } from './dto/patch-user.dto'
import { UserVopts } from './models/user.model'
import type { UserEntity, UserQuery } from './users.types'

/**
 * @file Subdomain Repository - UsersRepository
 * @module app/subdomains/users/repo
 */

export class UsersRepository extends Repository<UserEntity, UserQuery> {
  /**
   * Instantiates a new `UsersRepository`.
   */
  constructor() {
    super(repoPath(CONF.SUBDOMAINS.users.repo), UserVopts)
  }

  /**
   * Creates a new user.
   *
   * Throws a `400 BAD_REQUEST` if a user with email address {@param dto.email}
   * already exists.
   *
   * @async
   * @param {CreateUserDTO} dto - Data to create new user
   * @param {string} dto.email - User's email address
   * @param {string} dto.first_name - User's first name
   * @param {string} dto.last_name - User's last name
   * @param {string} dto.password - Alphanumeric password, at least 4 characters
   * @return {Promise<UserEntity>} Promise containing new user
   * @throws {AppException}
   */
  async create(dto: CreateUserDTO): OrNever<Promise<UserEntity>> {
    // Check if user with same email address already exists
    this.findOneByEmail(dto.email || '', {}, false)

    try {
      // Hash user's password (if missing, AppException will be thrown)
      if (typeof dto.password === 'string' && dto.password.trim().length) {
        dto.password = await hash(dto.password, 10)
      }
    } catch (error) {
      const status = ExceptionStatusCode.INTERNAL_SERVER_ERROR
      throw new AppException(status, error.message, dto)
    }

    return await super.create(dto)
  }

  /**
   * Find a user by email address.
   *
   * @async
   * @param {string} [email] - Email address of user to find
   * @param {UserQuery} [params] - Users repository query parameters
   * @param {boolean} [exists] - If `true`, throw error if user does exist;
   * othwerwise throw error if user with exists
   * @return {PartialOr<UserEntity> | null} User or null
   * @throws {AppException}
   */
  findOneByEmail(
    email: UserEntity['email'] = '',
    params: UserQuery = {},
    exists: boolean = true
  ): PartialOr<UserEntity> | null {
    const users = this.find({ ...params, email })
    const user = users[0] && users[0]?.email === email ? users[0] : null

    if (!user && exists) {
      const data = { errors: { email } }
      const message = `User with email "${email}" does not exist`

      throw new AppException(ExceptionStatusCode.NOT_FOUND, message, data)
    }

    if (user && !exists) {
      const message = `User with email "${email}" already exists`
      const data = { errors: { email } }

      throw new AppException(ExceptionStatusCode.BAD_REQUEST, message, data)
    }

    return user
  }

  /**
   * Partially updates a user.
   * The user's `created_at` and `id` properties cannot be patched.
   *
   * Throws a `400 BAD_REQUEST` if {@param dto.email} is a valid email address
   * and a user with same email address already exists.
   *
   * Throws a `404 NOT_FOUND` error if the entity isn't found.
   *
   * @async
   * @param {string} id - ID of user to update
   * @param {PatchUserDTO} dto - Data to patch entity
   * @param {string[]} [rfields] - Additional readonly fields
   * @return {Promise<UserEntity>} Promise containing updated user
   * @throws {AppException}
   */
  async patch(
    id: UserEntity['id'],
    dto: PatchUserDTO,
    rfields: []
  ): OrNever<Promise<UserEntity>> {
    // If valid email, check if user with same email address already exists
    if (typeof dto?.email === 'string') {
      this.findOneByEmail(dto.email, {}, false)
    }

    // Update user's password
    if (typeof dto?.password === 'string' && dto.password.trim().length) {
      try {
        dto.password = await hash(dto.password, 10)
      } catch (error) {
        const status = ExceptionStatusCode.INTERNAL_SERVER_ERROR
        throw new AppException(status, error.message, dto)
      }
    }

    return super.patch(id, dto, rfields)
  }
}

export default UsersRepository
