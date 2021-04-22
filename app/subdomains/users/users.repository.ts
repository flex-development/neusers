import type { SearchOptions } from '@algolia/client-search'
import { hash } from 'bcryptjs'
import { CustomRepository, getRepository } from 'fireorm'
import isString from 'lodash/isString'
import join from 'lodash/join'
import uniq from 'lodash/uniq'
import isEmail from 'validator/lib/isEmail'
import { CONF } from '../../config/configuration'
import { ExceptionStatus } from '../../lib/enums/exception-status.enum'
import AppException from '../../lib/exceptions/app.exception'
import Repository from '../../lib/repositories/algolia.repository'
import type { OrNever } from '../../lib/types'
import CreateUserDTO from './dto/create-user.dto'
import PatchUserDTO from './dto/patch-user.dto'
import type { IUser, UsersSearchParams } from './interfaces'
import User from './models/user.model'

/**
 * @file Subdomain Repository - UsersRepository
 * @module app/subdomains/users/repo
 */

@CustomRepository(User)
export class UsersRepository extends Repository<IUser, UsersSearchParams> {
  /**
   * Instantiates a new `UsersRepository`.
   */
  constructor() {
    super(CONF.SUBDOMAINS.users.repo)
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
   * @return {Promise<IUser>} Promise containing new user
   * @throws {AppException}
   */
  async create(dto: CreateUserDTO): OrNever<Promise<IUser>> {
    // Check if user with same email address already exists
    await this.findOneByEmail(dto.email || '', {}, false)

    try {
      // Hash user's password (if missing, AppException will be thrown)
      if (isString(dto.password)) dto.password = await hash(dto.password, 10)
    } catch (error) {
      const status = ExceptionStatus.INTERNAL_SERVER_ERROR
      throw new AppException(status, error.message, dto)
    }

    return await super.create(dto)
  }

  /**
   * Find a user by email address.
   *
   * @async
   * @param {string} [email] - Email address of user to find
   * @param {UsersSearchParams} [params] - Users search index parameters
   * @param {boolean} [exists] - If `true`, throw error if user does exist;
   * othwerwise throw error if user with exists
   * @return {Promise<IUser | null>} Promise containing new user or null
   * @throws {AppException}
   */
  async findOneByEmail(
    email: IUser['email'] = '',
    params: UsersSearchParams = {},
    exists: boolean = true
  ): OrNever<Promise<IUser | null>> {
    const { hits: users } = await this.findAll({ ...params, email })
    const user = users[0]

    if (!user && exists) {
      const data = { errors: { email } }
      const message = `User with email "${email}" does not exist`

      throw new AppException(ExceptionStatus.NOT_FOUND, message, data)
    }

    if (user && !exists) {
      const message = `User with email "${email}" already exists`
      const data = { errors: { email } }

      throw new AppException(ExceptionStatus.BAD_REQUEST, message, data)
    }

    return user || null
  }

  /**
   * Partially updates a user.
   * The user's `created_at` and `id` properties cannot be patched.
   *
   * Throws a `404 NOT_FOUND` error if the entity isn't found.
   *
   * Throws a `400 BAD_REQUEST` if {@param dto.email} is a valid email address
   * and a user with same email address already exists.
   *
   * @async
   * @param {string} id - ID of user to update
   * @param {PatchUserDTO} dto - Data to patch entity
   * @param {string[]} [rfields] - Additional readonly fields
   * @return {Promise<IUser>} Promise containing updated user
   * @throws {AppException}
   */
  async patch(
    id: IUser['id'],
    dto: PatchUserDTO,
    rfields: []
  ): OrNever<Promise<IUser>> {
    // If valid email, check if user with same email address already exists
    if (isString(dto?.email)) await this.findOneByEmail(dto.email, {}, false)

    // Update user's password
    if (isString(dto?.password)) {
      try {
        dto.password = await hash(dto.password, 10)
      } catch (error) {
        const status = ExceptionStatus.INTERNAL_SERVER_ERROR
        throw new AppException(status, error.message, dto)
      }
    }

    return super.patch(id, dto, rfields)
  }

  /**
   * Converts a `UserSearchParams` object into an Algolia search options object.
   *
   * - MSI = Number.MAX_SAFE_INTEGER
   *
   * @see https://www.algolia.com/doc/api-reference/api-parameters
   *
   * @param {UsersSearchParams} [params] - Users search index parameters
   * @param {string[]} [params.attributesToRetrieve] - List of fields to include
   * @param {number} [params.created_at_max] - Objects created before date
   * @param {number} [params.created_at_min] - Objects created after date
   * @param {boolean} [params.decompoundQuery] - Enable word segmentation
   * @param {boolean} [params.dttoa] - List of fields to disable typo tolerance
   * @param {string} [params.email] - Find user by email address
   * @param {string} [params.first_name] - Filter users by first name
   * @param {string} [params.filters] - Numeric, facet and/or tag filters
   * @param {number} [params.hitsPerPage] - Number of results per page
   * @param {string} [params.last_name] - Filter users by last name
   * @param {number} [params.length] - Number of hits to retrieve; [1,1000]
   * @param {string} [params.objectID] - Find user by ID
   * @param {number} [params.offset] - Offset of first hit to return; [1,MSI]
   * @param {string[]} [params.optionalWords] - List of words that should be
   * considered as optional when found in the query
   * @param {number} [params.page] - Page to retrieve; [0,MSI]
   * @param {number} [params.query] - Text to search in index
   * @param {number} [params.updated_at_max] - Objects modified before date
   * @param {number} [params.updated_at_min] - Objects modified after date
   * @param {string} [params.userToken] - Alphanumeric user identifier; [1,64]
   * @return {SearchOptions} Formatted Algolia search options object
   */
  searchOptions(params: UsersSearchParams = {}): SearchOptions {
    const { email = '', first_name, last_name, ...rest } = params

    // Get default search options
    const options = super.searchOptions(rest)

    // Initialize search filters array
    const filters: string[] = options.filters?.length ? [options.filters] : []

    // Add email filter
    if (isEmail(email)) filters.push(`email:${email}`)

    // Add first_name filter
    if (isString(first_name) && first_name.length) {
      filters.push(`first_name:"${first_name}"`)
    }

    // Add last_name filter
    if (isString(last_name) && last_name.length) {
      filters.push(`last_name:"${last_name}"`)
    }

    // Add email to attributesToRetrieve
    const attributesToRetrieve = options.attributesToRetrieve?.concat(['email'])

    return {
      ...options,
      attributesToRetrieve: uniq(attributesToRetrieve),
      filters: join(uniq(filters), '')
    }
  }
}

export default getRepository(User) as UsersRepository
