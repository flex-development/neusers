import { ExceptionStatusCode } from '@flex-development/exceptions'

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
