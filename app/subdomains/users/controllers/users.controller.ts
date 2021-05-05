import { SortOrder } from '@flex-development/dreepo/lib/enums'
import type {
  EntityPath,
  OneOrMany,
  PartialOr,
  ProjectionCriteria as Projection,
  ProjectStage
} from '@flex-development/dreepo/lib/types'
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query
} from '@nestjs/common'
import omit from 'lodash.omit'
import type { CreateUserDTO } from '../dto/create-user.dto'
import type { PatchUserDTO } from '../dto/patch-user.dto'
import UsersService from '../providers/users.service'
import type { UserEntity as User, UserQuery } from '../users.types'

/**
 * @file Subdomain Controller - UsersController
 * @module app/subdomains/users/controllers/UsersController
 */

@Controller('users')
export default class UsersController {
  constructor(private users: UsersService) {}

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
   * @param {string} dto.password - Alphanumeric password, at least 4 characters
   * @return {Promise<User>} Promise containing new user
   */
  @Post()
  async create(@Body() dto: CreateUserDTO): Promise<User> {
    return await this.users.create(dto)
  }

  /**
   * Deletes a user.
   *
   * Throws a `404` error if the user is not found.
   *
   * @todo Authenticate user
   *
   * @async
   * @param {string} id - UID of user to find
   * @return {Promise<string>} Promise containing UID of deleted user
   */
  @Delete(':user')
  async delete(@Param('user') id: User['id']): Promise<User['id']> {
    return (await this.users.delete(id, true))[0]
  }

  /**
   * Queries the users database.
   *
   * @async
   * @param {UserQuery} [query] - Query parameters
   * @param {number} [query.$limit] - Limit number of results
   * @param {ProjectStage<User>} [query.$project] - Fields to include
   * @param {number} [query.$skip] - Skips the first n entities
   * @param {Record<EntityPath<User>, SortOrder>} [query.$sort] - Sorting rules
   * @param {Projection<User>} [query.projection] - Projection operators
   * @return {Promise<PartialOr<User>[]>} Promise containing search results
   */
  @Get()
  async find(@Query() query: UserQuery = {}): Promise<Partial<User>[]> {
    // ! Remove Vercel query parameter `path`
    return this.users.find(omit(query, ['path']))
  }

  /**
   * Finds user by ID or email address.
   *
   * Throws an error if the user isn't found.
   *
   * @todo Authenticate user
   * @todo Remove sensitive data if user isn't authenticated
   *
   * @async
   * @param {string} user - UID or email address of user to find
   * @param {UserQuery} [query] - Query parameters
   * @return {Promise<PartialOr<User>>} Promise containing user data
   */
  @Get(':user')
  async findOne(
    @Param('user') user: User['email'] | User['id'],
    @Query() query: UserQuery = {}
  ): Promise<PartialOr<User>> {
    // ! Remove Vercel query parameter `path`
    return await this.users.findOne(user, omit(query, ['path']))
  }

  /**
   * Partially updates a user.
   *
   * The user's `created_at` and `id` properties cannot be patched.
   *
   * Throws a `404` error if the user is not found, or a `400` error if a user
   * with the same email already exists.
   *
   * @todo Authenticate user
   *
   * @async
   * @param {string} id - ID of user to update
   * @param {PatchUserDTO} dto - Data to patch entity
   * @param {string[]} [rfields] - Additional readonly fields
   * @return {Promise<User>} Promise containing updated user
   */
  @Patch(':user')
  async patch(
    @Param('user') id: User['id'],
    @Body() dto: PatchUserDTO,
    @Query('rfields') rfields: string[] = []
  ): Promise<User> {
    return await this.users.patch(id, dto, rfields)
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
  @Post('/upsert')
  async upsert(
    @Body() dto: OneOrMany<CreateUserDTO | PatchUserDTO>
  ): Promise<User[]> {
    return await this.users.upsert(dto)
  }
}
