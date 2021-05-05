import { SortOrder } from '@flex-development/dreepo/lib/enums'
import type {
  EntityPath,
  OneOrMany,
  PartialOr,
  ProjectionCriteria as Projection,
  ProjectStage
} from '@flex-development/dreepo/lib/types'
import { Injectable } from '@nestjs/common'
import omit from 'lodash.omit'
import isEmail from 'validator/lib/isEmail'
import type { CreateUserDTO } from '../dto/create-user.dto'
import type { PatchUserDTO } from '../dto/patch-user.dto'
import type { UserEntity as User, UserQuery as Query } from '../users.types'
import UsersRepository from './users.repository'

/**
 * @file Subdomain Providers - UsersService
 * @module app/subdomains/users/providers/UsersService
 */

@Injectable()
export default class UsersService {
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
   * @return {Promise<User>} Promise containing new user
   */
  async create(dto: CreateUserDTO): Promise<User> {
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
    id: OneOrMany<User['id']>,
    should_exist: boolean = false
  ): Promise<typeof id> {
    return await this.repo.delete(id, should_exist)
  }

  /**
   * Queries the users database.
   *
   * @async
   * @param {Query} [query] - Query parameters
   * @param {number} [query.$limit] - Limit number of results
   * @param {ProjectStage<User>} [query.$project] - Fields to include
   * @param {number} [query.$skip] - Skips the first n entities
   * @param {Record<EntityPath<User>, SortOrder>} [query.$sort] - Sorting rules
   * @param {Projection<User>} [query.projection] - Projection operators
   * @return {Promise<Partial<User>[]>} Promise containing search results
   */
  async find(query: Query = {}): Promise<Partial<User>[]> {
    const users = this.repo.find(query)
    return users.length ? users.map(u => omit(u, ['password'])) : users
  }

  /**
   * Finds user by ID or email address.
   *
   * Throws an error if the user isn't found.
   *
   * @async
   * @param {string} user - UID or email address of user to find
   * @param {Query} [query] - Query parameters
   * @return {Promise<PartialOr<User>>} Promise containing user data
   */
  async findOne(user: string, query: Query = {}): Promise<PartialOr<User>> {
    if (!isEmail(user)) return this.repo.findOneOrFail(user, query)
    return this.repo.findOneByEmail(user, query) as User
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
   * @return {Promise<User>} Promise containing updated user
   */
  async patch(
    id: User['id'],
    dto: PatchUserDTO,
    rfields: string[] = []
  ): Promise<User> {
    return await this.repo.patch(id, dto, rfields)
  }

  /**
   * Creates or updates a single user or array of users.
   *
   * If any users already exist, their entry will be patched. If any users don't
   * exist, they'll be inserted into the database.
   *
   * @async
   * @param {OneOrMany<CreateUserDTO | PatchUserDTO>} dto - Users to upsert
   * @return {Promise<User[]>} Promise with new or updated users
   */
  async upsert(dto: OneOrMany<CreateUserDTO | PatchUserDTO>): Promise<User[]> {
    return await this.repo.save(dto)
  }
}