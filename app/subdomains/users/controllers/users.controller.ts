import type { PartialOr } from '@flex-development/dreepo'
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
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
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger'
import omit from 'lodash.omit'
import { OPENAPI_GLOBALS } from '../../../lib'
import { CreateUserDTO, PatchUserDTO } from '../dto'
import { AuthInterceptor } from '../interceptors'
import type { IUser, IUsersController } from '../interfaces'
import { UsersService } from '../providers'
import openapi from '../users.openapi'
import type { UserQuery } from '../users.types'

/**
 * @file Users Subdomain Controller - UsersController
 * @module app/subdomains/users/controllers/UsersController
 * @see https://docs.nestjs.com/openapi/types-and-parameters#extra-models
 */

@Controller(openapi.controller)
@ApiTags(...openapi.tags)
export default class UsersController implements IUsersController {
  constructor(readonly users: UsersService) {}

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
  @Post()
  @HttpCode(openapi.create.status)
  @ApiCreatedResponse(openapi.create.responses[201])
  @ApiBadRequestResponse(openapi.create.responses[400])
  @ApiConflictResponse(openapi.create.responses[409])
  @ApiInternalServerErrorResponse(OPENAPI_GLOBALS.responses[500])
  @ApiBadGatewayResponse(OPENAPI_GLOBALS.responses[502])
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
  @UseInterceptors(AuthInterceptor)
  @Delete(':user')
  @HttpCode(openapi.delete.status)
  @ApiNoContentResponse(openapi.delete.responses[204])
  @ApiUnauthorizedResponse(openapi.delete.responses[401])
  @ApiInternalServerErrorResponse(OPENAPI_GLOBALS.responses[500])
  @ApiBadGatewayResponse(OPENAPI_GLOBALS.responses[502])
  async delete(@Param('user') id: IUser['id']): Promise<void> {
    await this.users.delete(id, true)
    return
  }

  /**
   * Queries the users database.
   *
   * @async
   * @param {UserQuery} [query] - Users URL query parameters
   * @return {Promise<PartialOr<IUser>[]>} Promise containing results
   */
  @Get()
  @HttpCode(openapi.find.status)
  @ApiQuery(openapi.find.query)
  @ApiOkResponse(openapi.find.responses[200])
  @ApiBadRequestResponse(openapi.find.responses[400])
  @ApiInternalServerErrorResponse(OPENAPI_GLOBALS.responses[500])
  @ApiBadGatewayResponse(OPENAPI_GLOBALS.responses[502])
  async find(@Query() query: UserQuery = {}): Promise<Partial<IUser>[]> {
    return this.users.find(query)
  }

  /**
   * Queries a user by ID or email address.
   *
   * Throws an error if the user isn't found.
   *
   * @async
   * @param {string} user - UID or email address of user to find
   * @param {boolean} [authorized] - Boolean indicating is user is logged in
   * @param {UserQuery} [query] - Users URL query parameters
   * @return {Promise<PartialOr<IUser>>} Promise containing user data
   */
  @UseInterceptors(AuthInterceptor)
  @Get(':user')
  @HttpCode(openapi.findOne.status)
  @ApiQuery(openapi.findOne.query)
  @ApiOkResponse(openapi.findOne.responses[200])
  @ApiBadRequestResponse(openapi.findOne.responses[400])
  @ApiNotFoundResponse(openapi.findOne.responses[404])
  @ApiInternalServerErrorResponse(OPENAPI_GLOBALS.responses[500])
  @ApiBadGatewayResponse(OPENAPI_GLOBALS.responses[502])
  async findOne(
    @Param('user') user: IUser['email'] | IUser['id'],
    @Param('authorized', ParseBoolPipe) authorized: boolean = false,
    @Query() query: UserQuery = {}
  ): Promise<PartialOr<IUser>> {
    const found = await this.users.findOne(user, query)

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
  @UseInterceptors(AuthInterceptor)
  @Put(':user')
  @HttpCode(openapi.patch.status)
  @ApiOkResponse(openapi.patch.responses[200])
  @ApiBadRequestResponse(openapi.patch.responses[400])
  @ApiConflictResponse(openapi.patch.responses[409])
  @ApiInternalServerErrorResponse(OPENAPI_GLOBALS.responses[500])
  @ApiBadGatewayResponse(OPENAPI_GLOBALS.responses[502])
  async patch(
    @Param('user') id: IUser['id'],
    @Body() dto: PatchUserDTO,
    @Query('rfields', new ParseArrayPipe({ items: String, optional: true }))
    rfields: string[] = []
  ): Promise<IUser> {
    return await this.users.patch(id, dto, rfields)
  }
}
