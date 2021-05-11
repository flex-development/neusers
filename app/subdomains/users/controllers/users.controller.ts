import type {
  EntityPath,
  PartialOr,
  ProjectionCriteria as Projection,
  ProjectStage
} from '@flex-development/dreepo'
import { SortOrder } from '@flex-development/dreepo'
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseArrayPipe,
  ParseBoolPipe,
  Post,
  Put,
  Query,
  UseInterceptors
} from '@nestjs/common'
import {
  ApiBadGatewayResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger'
import omit from 'lodash.omit'
import ExceptionJSON from '../../../lib/models/exeception-json.model'
import { CreateUserDTO, PatchUserDTO } from '../dto'
import AuthInterceptor from '../interceptors/auth.interceptor'
import type { IUser } from '../interfaces'
import PartialUser from '../models/user-partial.model'
import User from '../models/user.model'
import UsersService from '../providers/users.service'
import type { UserQuery } from '../users.types'

/**
 * @file Users Subdomain Controller - UsersController
 * @module app/subdomains/users/controllers/UsersController
 */

@Controller('users')
@ApiTags('users')
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
   * @return {Promise<IUser>} Promise containing new user
   */
  @HttpCode(HttpStatus.CREATED)
  @Post()
  @ApiCreatedResponse({ description: 'Created new user', type: User })
  @ApiBadRequestResponse({
    description: 'Schema validation error',
    type: ExceptionJSON
  })
  @ApiConflictResponse({
    description: 'User with email or id already exists',
    type: ExceptionJSON
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    type: ExceptionJSON
  })
  @ApiBadGatewayResponse({ description: 'Vercel hosting error' })
  async create(@Body() dto: CreateUserDTO): Promise<IUser> {
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
  @UseInterceptors(AuthInterceptor)
  @Delete(':user')
  @ApiNoContentResponse({ description: 'Deleted user' })
  @ApiUnauthorizedResponse({
    description: 'User not logged in',
    type: ExceptionJSON
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    type: ExceptionJSON
  })
  @ApiBadGatewayResponse({ description: 'Vercel hosting error' })
  async delete(@Param('user') id: IUser['id']): Promise<void> {
    await this.users.delete(id, true)
    return
  }

  /**
   * Queries the users database.
   *
   * @async
   * @param {UserQuery} [query] - Query parameters
   * @param {number} [query.$limit] - Limit number of results
   * @param {ProjectStage<IUser>} [query.$project] - Fields to include
   * @param {number} [query.$skip] - Skips the first n entities
   * @param {Record<EntityPath<IUser>, SortOrder>} [query.$sort] - Sorting rules
   * @param {Projection<IUser>} [query.projection] - Projection operators
   * @return {Promise<PartialOr<IUser>[]>} Promise containing results
   */
  @HttpCode(HttpStatus.OK)
  @Get()
  @ApiOkResponse({
    description: 'Successfully queried database',
    isArray: true,
    type: PartialUser
  })
  @ApiBadRequestResponse({
    description: 'Error executing query',
    type: ExceptionJSON
  })
  @ApiBadGatewayResponse({ description: 'Vercel hosting error' })
  async find(@Query() query: UserQuery = {}): Promise<Partial<IUser>[]> {
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
   * @return {Promise<PartialOr<IUser>>} Promise containing user data
   */
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(AuthInterceptor)
  @Get(':user')
  @ApiOkResponse({
    description: 'Found user by ID or email address',
    type: PartialUser
  })
  @ApiBadRequestResponse({
    description: 'Error executing query',
    type: ExceptionJSON
  })
  @ApiNotFoundResponse({ description: 'User not found', type: ExceptionJSON })
  @ApiBadGatewayResponse({ description: 'Vercel hosting error' })
  async findOne(
    @Param('user') user: IUser['email'] | IUser['id'],
    @Param('authorized', ParseBoolPipe) authorized: boolean = false,
    @Query() query: UserQuery = {}
  ): Promise<PartialOr<IUser>> {
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
   * Throws a `404 NOT_FOUND` error if the user is not found.
   * Throws a `409 CONFLICT` error if a user with the same email already exists.
   *
   * @async
   * @param {string} id - ID of user to update
   * @param {PatchUserDTO} dto - Data to patch entity
   * @param {string[]} [rfields] - Additional readonly fields
   * @return {Promise<IUser>} Promise containing updated user
   */
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(AuthInterceptor)
  @Put(':user')
  @ApiOkResponse({ description: 'Successfully updated user', type: User })
  @ApiBadRequestResponse({
    description: 'Schema validation error',
    type: ExceptionJSON
  })
  @ApiConflictResponse({
    description: 'User with email already exists',
    type: ExceptionJSON
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
    type: ExceptionJSON
  })
  @ApiBadGatewayResponse({ description: 'Vercel hosting error' })
  async patch(
    @Param('user') id: IUser['id'],
    @Body() dto: PatchUserDTO,
    @Query('rfields', new ParseArrayPipe({ items: String, optional: true }))
    rfields: string[] = []
  ): Promise<IUser> {
    return await this.users.patch(id, dto, rfields)
  }
}
