import type { OneOrMany, PartialOr } from '@flex-development/dreepo'
import { Injectable } from '@nestjs/common'
import omit from 'lodash.omit'
import isEmail from 'validator/lib/isEmail'
import { CreateUserDTO, PatchUserDTO } from '../dto'
import type { IUser, IUsersService } from '../interfaces'
import type { UserQuery } from '../users.types'
import UsersRepository from './users.repository'

/**
 * @file Users Subdomain Providers - UsersService
 * @module app/subdomains/users/providers/UsersService
 */

@Injectable()
export default class UsersService implements IUsersService {
  constructor(readonly repo: UsersRepository) {}

  /**
   * Creates a new user.
   *
   * The user will be timestamped and assigned an UUID if {@param dto.id} is
   * nullable or an empty string.
   *
   * Throws a `409 CONFLICT` error if a user with the email {@param dto.email}
   * or id {@param dto.id} already exists.
   *
   * Throws a `400 BAD_REQUEST` if schema validation fails.
   *
   * @async
   * @param {CreateUserDTO} dto - Data to create new user
   * @param {string} dto.email - User's email address
   * @param {string} dto.first_name - User's first name
   * @param {string} dto.last_name - User's last name
   * @param {string} dto.password - Alphanumeric password, at least 8 characters
   * @return {Promise<IUser>} Promise containing new user
   */
  async create(dto: CreateUserDTO): Promise<IUser> {
    return await this.repo.create(dto)
  }

  /**
   * Deletes a single user or group of users.
   *
   * If {@param should_exist} is `true`, an error will be thrown if the entity
   * or one of the entities doesn't exist.
   *
   * @async
   * @param {OneOrMany<string>} id - User ID or array of user IDs
   * @param {boolean} [should_exist] - Throw if any users don't exist
   * @return {Promise<string[]>} Promise with array of deleted entity IDs
   */
  async delete(
    id: OneOrMany<IUser['id']>,
    should_exist: boolean = false
  ): Promise<typeof id> {
    return await this.repo.delete(id, should_exist)
  }

  /**
   * Queries the users database.
   *
   * @async
   * @param {UserQuery} [query] - Users URL query parameters
   * @return {Promise<Partial<IUser>[]>} Promise containing search results
   */
  async find(query: UserQuery = {}): Promise<Partial<IUser>[]> {
    const users = this.repo.query(query)
    return users.length ? users.map(u => omit(u, ['password'])) : users
  }

  /**
   * Queries a user by ID or email address.
   *
   * Throws an error if the user isn't found.
   *
   * @async
   * @param {string} user - UID or email address of user to find
   * @param {UserQuery} [query] - Users URL query parameters
   * @return {Promise<PartialOr<IUser>>} Promise containing user data
   */
  async findOne(
    user: string,
    query: UserQuery = {}
  ): Promise<PartialOr<IUser>> {
    if (!isEmail(user)) return this.repo.queryOneOrFail(user, query)
    return this.repo.queryOneByEmail(user, query) as IUser
  }

  /**
   * Partially updates a user.
   *
   * The user's `created_at` and `id` properties cannot be patched.
   *
   * Throws a `404` error if the user is not found, or a `400` error if a user
   * with the same email already exists.
   *
   * @async
   * @param {string} id - ID of user to update
   * @param {PatchUserDTO} dto - Data to patch entity
   * @param {string[]} [rfields] - Additional readonly fields
   * @return {Promise<IUser>} Promise containing updated user
   */
  async patch(
    id: IUser['id'],
    dto: PatchUserDTO,
    rfields: string[] = []
  ): Promise<IUser> {
    return await this.repo.patch(id, dto, rfields)
  }
}
