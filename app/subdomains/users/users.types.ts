import type {
  PartialOr,
  RepoParsedUrlQuery,
  RepoSearchParams
} from '@flex-development/dreepo'
import type { InterceptorResponse } from '../../lib/types'
import type { IUser } from './interfaces'

/**
 * @file Users Subdomain Type Definitions
 * @module app/subdomains/users/types
 */

/**
 * Types of payloads streamed through the `AuthInterceptor`.
 */
export type AuthInterceptorResponse = InterceptorResponse<PartialOr<IUser>>

/**
 * Object representing a decoded Basic Authorization header.
 */
export type BasicAuthDecoded = {
  email: IUser['email']
  password: IUser['password']
}

/**
 * Search parameters accepted by the `UsersRepository`.
 */
export type UserParams = Omit<RepoSearchParams<IUser>, 'projection'>

/**
 * URL query parameters accepted by the `UsersRepository`.
 */
export type UserQuery = RepoParsedUrlQuery<IUser>
