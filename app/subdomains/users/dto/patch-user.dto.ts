import type { EntityDTO } from '@flex-development/dreepo'
import { PartialType } from '@nestjs/swagger'
import type { IUser } from '../interfaces'
import CreateUserDTO from './create-user.dto'

/**
 * @file Users Subdomain DTO - PatchUserDTO
 * @module app/subdomains/users/dto/PatchUser
 * @see https://docs.nestjs.com/openapi/mapped-types#partial
 */

export default class PatchUserDTO
  extends PartialType(CreateUserDTO)
  implements Partial<EntityDTO<IUser>> {}
