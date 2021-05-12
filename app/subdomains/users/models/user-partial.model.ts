import { PartialType, PickType } from '@nestjs/swagger'
import type { IUser } from '../interfaces'
import User from './user.model'

/**
 * @file Users Subdomain Model - PartialUser
 * @module app/subdomains/users/PartialUser
 * @see https://docs.nestjs.com/openapi/mapped-types#partial
 * @see https://docs.nestjs.com/openapi/mapped-types#pick
 */

export default class PartialUser
  extends PickType(PartialType(User), ['id'] as const)
  implements Partial<IUser> {}
