import type {
  QueryParams,
  RepoValidatorOptsDTO
} from '@flex-development/dreepo/lib/types'
import { Static } from 'runtypes'
import { User } from './models/user.model'

/**
 * @file Subdomain Type Definitions
 * @module app/subdomains/users/types
 */

/**
 * User database entity.
 */
export type UserEntity = Static<typeof User>

/**
 * Query parameters accepted by the `UsersRepository`.
 */
export type UserQuery = QueryParams<UserEntity>

/**
 * Validator options DTO accepted by the `UsersRepository`.
 */
export type UsersRepoValidatorOptsDTO = RepoValidatorOptsDTO<UserEntity>
