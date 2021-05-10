import type { ExceptionJSON as IExceptionJSON } from '@flex-development/exceptions/interfaces'
import { ApiProperty } from '@nestjs/swagger'
import Meta from '../metadata/exception-json.metadata'

/**
 * @file Global Model - ExceptionJSON
 * @module app/lib/models/ExceptionJSON
 * @see https://docs.nestjs.com/openapi/types-and-parameters
 */

export default class ExceptionJSON implements IExceptionJSON {
  @ApiProperty(Meta.className)
  readonly className: IExceptionJSON['className']

  @ApiProperty(Meta.code)
  readonly code: IExceptionJSON['code']

  @ApiProperty(Meta.message)
  readonly message: IExceptionJSON['message']

  @ApiProperty(Meta.name)
  readonly name: IExceptionJSON['name']

  @ApiProperty(Meta.data)
  data: IExceptionJSON['data']

  @ApiProperty(Meta.errors)
  errors: IExceptionJSON['errors']
}
