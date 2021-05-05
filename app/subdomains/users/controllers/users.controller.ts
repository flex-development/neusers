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
  HttpCode,
  HttpStatus,
  Param,
  ParseBoolPipe,
  Post,
  Put,
  Query,
  UseInterceptors
} from '@nestjs/common'
import omit from 'lodash.omit'
import type { CreateUserDTO } from '../dto/create-user.dto'
import type { PatchUserDTO } from '../dto/patch-user.dto'
import AuthInterceptor from '../interceptors/auth.interceptor'
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
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Body() dto: CreateUserDTO): Promise<User> {
    return await this.users.create(dto)
  }

  /**
   * Deletes a user.
   *
   * Throws a `404` error if the user is not found.
   *
   * @async
   * @param {string} id - UID of user to find
   * @return {Promise<void>} Empty promise when user is deleted
   */
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':user')
  @UseInterceptors(AuthInterceptor)
  async delete(@Param('user') id: User['id']): Promise<void> {
    await this.users.delete(id, true)
    return
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
  @HttpCode(HttpStatus.OK)
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
   * @async
   * @param {string} user - UID or email address of user to find
   * @param {boolean} [authorized] - Boolean indicating is user is logged in
   * @param {UserQuery} [query] - Query parameters
   * @return {Promise<PartialOr<User>>} Promise containing user data
   */
  @HttpCode(HttpStatus.OK)
  @Get(':user')
  @UseInterceptors(AuthInterceptor)
  async findOne(
    @Param('user') user: User['email'] | User['id'],
    @Param('authorized', ParseBoolPipe) authorized: boolean = false,
    @Query() query: UserQuery = {}
  ): Promise<PartialOr<User>> {
    // ! Remove Vercel query parameter `path`
    const found = await this.users.findOne(user, omit(query, ['path']))

    // ! If user is found and not logged in, remove sensitive data
    return authorized ? found : omit(found, ['password'])
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
   *
   * @param {string} id - ID of user to update
   * @param {PatchUserDTO} dto - Data to patch entity
   * @param {string[]} [rfields] - Additional readonly fields
   * @return {Promise<User>} Promise containing updated user
   */
  @HttpCode(HttpStatus.OK)
  @Put(':user')
  @UseInterceptors(AuthInterceptor)
  async patch(
    @Param('user') id: User['id'],
    @Body() dto: PatchUserDTO,
    @Query('rfields') rfields: string[] = []
  ): Promise<User> {
    return await this.users.patch(id, dto, JSON.parse(`${rfields}`))
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
  @HttpCode(HttpStatus.OK)
  @Post('/upsert')
  async upsert(
    @Body() dto: OneOrMany<CreateUserDTO | PatchUserDTO>
  ): Promise<User[]> {
    return await this.users.upsert(dto)
  }
}
