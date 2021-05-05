import type { OneOrMany } from '@flex-development/dreepo/lib/types-global'
import { ExceptionStatusCode } from '@flex-development/exceptions'
import type { PlainObject } from 'simplytyped'

/**
 * @file Global Type Definitions
 * @module app/lib/types
 */

/**
 * JSON response from an `HttpException`.
 */
export interface HttpExceptionJSON {
  message: string
  statusCode: ExceptionStatusCode
}

/**
 * Return value of a runtypes constraint function.
 *
 * - https://github.com/pelotom/runtypes#constraint-checking
 */
export type ConstraintResult = boolean | string

/**
 * Return value of a runtypes constraint function with a custom error message.
 *
 * - https://github.com/pelotom/runtypes#constraint-checking
 */
export type ConstraintResultCustom = true | string

/**
 * Type of value wrapped by inteceptor observables.
 */
export type InterceptorResponse<T = PlainObject> = OneOrMany<T> | void
