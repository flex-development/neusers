import { InterceptorResponse } from '@/lib/types'
import type {
  PartialOr,
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
 * Types of payloads streamed through the `AuthInterceptor`.
 */
export type AuthInterceptorResponse = InterceptorResponse<PartialOr<UserEntity>>

/**
 * Object representing a decoded Basic Authorization header.
 */
export type BasicAuthDecoded = {
  email: UserEntity['email']
  password: UserEntity['password']
}

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
