import {
  ExceptionClassName,
  ExceptionStatusCode
} from '@flex-development/exceptions/enums'
import type { ExceptionJSON } from '@flex-development/exceptions/interfaces'
import type { SchemaMetadata } from '../types'

/**
 * @file Schema Metadata - ExceptionJSON
 * @module app/lib/metadata/ExceptionJSON
 */

const metadata: SchemaMetadata<ExceptionJSON> = {
  className: {
    description: 'CSS class name',
    enum: [ExceptionClassName],
    type: 'string'
  },
  code: {
    description: 'HTTP status code',
    enum: [ExceptionStatusCode],
    type: 'number'
  },
  data: {
    description: 'Additional error data',
    type: 'object'
  },
  errors: {
    anyOf: [
      { nullable: true, type: 'object' },
      { items: { type: 'object' }, nullable: true },
      { items: { type: 'string' }, nullable: true }
    ]
  },
  message: {
    description: 'Error message',
    type: 'string'
  },
  name: {
    description: 'HTTP status code name',
    type: 'string'
  }
}

export default metadata
