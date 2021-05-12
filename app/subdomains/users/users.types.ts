import type { PartialOr, QueryParams } from '@flex-development/dreepo'
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
 * Query parameters accepted by the `UsersRepository`.
 */
export type UserQueryParams = Omit<QueryParams<IUser>, 'projection'>
