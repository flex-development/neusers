import type { PlainObject } from 'simplytyped'
import { ExceptionClassName, ExceptionStatus } from '../enums'

/**
 * @file Interface - IAPIException
 * @module app/lib/interfaces/IAPIException
 */

export interface IAPIException {
  readonly className: ExceptionClassName
  readonly code: ExceptionStatus
  readonly data: PlainObject
  readonly errors?: PlainObject | (PlainObject | string)[]
  readonly message: string
  readonly name: keyof typeof ExceptionStatus
}

export type APIExceptionErrors = PlainObject | (PlainObject | string)[]
