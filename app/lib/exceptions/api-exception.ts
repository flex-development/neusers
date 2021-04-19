import { HttpException } from '@nestjs/common'
import omit from 'lodash/omit'
import type { PlainObject } from 'simplytyped'
import {
  ExceptionClassName as ClassName,
  ExceptionStatus as Status
} from '../enums'
import type {
  APIExceptionErrors as ExceptionErrors,
  IAPIException as IException
} from '../interfaces'

/**
 * @file Implementation - APIException
 * @module app/lib/exceptions/api-exception
 */

/**
 * Defines an API exception.
 *
 * @class
 * @extends HttpException
 */
export default class APIException extends HttpException {
  /**
   * Instantiate an `APIException` Exception.
   *
   * @param {Status} [code] - HTTP error code
   * @param {string} [message] - Error message
   * @param {PlainObject} [data] - Additional error data
   * @param {ExceptionErrors} [data.errors] - Exception errors
   */
  constructor(
    code: Status = Status.INTERNAL_SERVER_ERROR,
    message: string = 'Internal server error',
    data: PlainObject = {}
  ) {
    super(APIException.createBody(data, message, code), code)
  }

  /**
   * Generates a JSON object representing an APIException.
   *
   * @param {PlainObject} [data] - Additional error data
   * @param {string} [message] - Error message
   * @param {Status} [code] - HTTP error code
   * @return {IException} JSON object representing an APIException
   */
  public static createBody(
    data: PlainObject | string = {},
    message: string = 'Internal server error',
    code: Status = Status.INTERNAL_SERVER_ERROR
  ): IException {
    if (typeof data === 'string') data = { message }

    const name = Object.keys(Status).find(key => Status[key] === code) || ''

    return {
      className: ClassName[name],
      code,
      data: omit(data, ['errors']),
      errors: data.errors,
      message: data.message || message,
      name: name as IException['name']
    }
  }
}
