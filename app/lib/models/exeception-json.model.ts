import {
  ExceptionClassName,
  ExceptionStatusCode
} from '@flex-development/exceptions/enums'
import type { ExceptionJSON as IExceptionJSON } from '@flex-development/exceptions/interfaces'
import { ApiProperty } from '@nestjs/swagger'
import { isNumber } from 'class-validator'
import isNumeric from 'validator/lib/isNumeric'

/**
 * @file Global Model - ExceptionJSON
 * @module app/lib/models/ExceptionJSON
 * @see https://docs.nestjs.com/openapi/types-and-parameters
 */

export default class ExceptionJSON implements IExceptionJSON {
  /**
   * @property {number[]} CODES - HTTP error status codes
   */
  static CODES: number[] = (() => {
    const values = Object.values(ExceptionStatusCode)
    return values.filter(v => isNumber(v)) as number[]
  })()

  /**
   * @property {string[]} NAMES - Names of HTTP error status codes
   */
  static NAMES: string[] = Object.keys(ExceptionStatusCode).filter(key => {
    return !isNumeric(key)
  })

  @ApiProperty({
    description: 'CSS class name',
    enum: Object.values(ExceptionClassName),
    type: 'string'
  })
  readonly className: IExceptionJSON['className']

  @ApiProperty({
    description: 'HTTP status code',
    enum: ExceptionJSON.CODES,
    type: 'number'
  })
  readonly code: IExceptionJSON['code']

  @ApiProperty({
    description: 'Error message',
    type: 'string'
  })
  readonly message: IExceptionJSON['message']

  @ApiProperty({
    description: 'HTTP status code name',
    enum: ExceptionJSON.NAMES,
    type: 'string'
  })
  readonly name: IExceptionJSON['name']

  @ApiProperty({
    description: 'Additional error data',
    type: 'object'
  })
  data: IExceptionJSON['data']

  @ApiProperty({
    anyOf: [
      { nullable: true, type: 'object' },
      { items: { type: 'object' }, nullable: true },
      { items: { type: 'string' }, nullable: true }
    ]
  })
  errors: IExceptionJSON['errors']
}
