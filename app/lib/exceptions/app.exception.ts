import { ExceptionStatusCode } from '@flex-development/exceptions/enums'
import { DEM } from '@flex-development/exceptions/exceptions'
import Exception from '@flex-development/exceptions/exceptions/base.exception'
import type { ExceptionJSON } from '@flex-development/exceptions/interfaces'
import type { ExceptionErrors } from '@flex-development/exceptions/types'
import { HttpException } from '@nestjs/common'
import type { PlainObject } from 'simplytyped'

/**
 * @file Exceptions - AppException
 * @module app/lib/exceptions/AppException
 */

/**
 * Defines an API application exception.
 *
 * @class
 * @extends HttpException
 */
export default class AppException extends HttpException {
  /**
   * @readonly
   * @instance
   * @property {Exception} exception - Underlying exception
   */
  readonly exception: Exception

  /**
   * Instantiate an `AppException` Exception.
   *
   * @param {ExceptionStatusCode} [code] - HTTP error code
   * @param {string} [message] - Error message
   * @param {PlainObject | string} [data] - Additional error data
   * @param {ExceptionErrors} [data.errors] - Exception errors
   */
  constructor(
    code: ExceptionStatusCode = ExceptionStatusCode.INTERNAL_SERVER_ERROR,
    message: string = DEM,
    data: PlainObject | string = {}
  ) {
    super({}, code)

    // If additional error data is a a string, convert into error message object
    if (typeof data === 'string') data = { message: data }

    // Initialize underlying exception
    this.exception = new Exception(code, message, data, this.stack)

    // @ts-expect-error overriding response body
    this.response = this.exception.toJSON()
  }

  /**
   * Generates a JSON object representing an AppException.
   *
   * @param {PlainObject | string} [data] - Additional error data
   * @param {string} [message] - Error message
   * @param {ExceptionStatusCode} [code] - HTTP error code
   * @return {ExceptionJSON} JSON object representing an AppException
   */
  public static createBody(
    data: PlainObject | string = {},
    message: string = DEM,
    code: ExceptionStatusCode = ExceptionStatusCode.INTERNAL_SERVER_ERROR
  ): ExceptionJSON {
    if (typeof data === 'string') data = { message: data }
    return new Exception(code, message, data).toJSON()
  }
}
