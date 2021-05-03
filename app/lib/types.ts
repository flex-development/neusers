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
