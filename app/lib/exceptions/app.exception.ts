import { HttpException } from '@nestjs/common'
import omit from 'lodash/omit'
import type { PlainObject } from 'simplytyped'
import {
  ExceptionClassName as ClassName,
  ExceptionStatus as Status
} from '../enums'
import type { AppExceptionJSON as IException } from '../interfaces'
import type { AppExceptionErrors as ExceptionErrors } from '../types'

/**
 * @file Exceptions - AppException
 * @module app/lib/exceptions/app.exception
 */

/**
 * Defines an API exception.
 *
 * @class
 * @extends HttpException
 */
export default class AppException extends HttpException {
  /**
   * Instantiate an `AppException` Exception.
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
    super(AppException.createBody(data, message, code), code)
  }

  /**
   * Generates a JSON object representing an AppException.
   *
   * @param {PlainObject} [data] - Additional error data
   * @param {string} [message] - Error message
   * @param {Status} [code] - HTTP error code
   * @return {IException} JSON object representing an AppException
   */
  public static createBody(
    data: PlainObject | string = {},
    message: string = 'Internal server error',
    code: Status = Status.INTERNAL_SERVER_ERROR
  ): IException {
    if (typeof data === 'string') data = { message: data }

    const name = Object.keys(Status).find(key => Status[key] === code) || ''

    /* eslint-disable sort-keys */

    return {
      name: name as IException['name'],
      message: typeof data?.message === 'string' ? data.message : message,
      code,
      className: ClassName[name],
      data: omit(data, ['errors', 'message']),
      errors: data.errors
    }

    /* eslint-enable sort-keys */
  }
}
