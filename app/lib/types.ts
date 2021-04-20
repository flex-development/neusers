import type { PlainObject } from 'simplytyped'
import type { ExceptionStatus } from './enums/exception-status.enum'

/**
 * @file Global Type Definitions
 * @module app/lib/types
 */

export type AppExceptionErrors = PlainObject | (PlainObject | string)[]

export interface HttpExceptionJSON {
  message: string
  statusCode: ExceptionStatus
}
