import type { PlainObject } from 'simplytyped'
import { ExceptionClassName, ExceptionStatus } from '../enums'
import type { AppExceptionErrors } from '../types'

/**
 * @file Interface - AppExceptionJSON
 * @module app/lib/interfaces/AppExceptionJSON
 */

export interface AppExceptionJSON {
  readonly className: ExceptionClassName
  readonly code: ExceptionStatus
  readonly data: PlainObject
  readonly errors?: AppExceptionErrors
  readonly message: string
  readonly name: keyof typeof ExceptionStatus
}
