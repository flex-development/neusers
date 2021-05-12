import { SortOrder } from '@flex-development/dreepo'
import { PlainObject } from 'simplytyped'
import { ExceptionJSON } from './models'

/**
 * @file Constant Values
 * @module app/lib/constants
 */

/**
 * @property {[boolean, boolean, 0, 1]} $PROJECT_ENUM - $project query values
 */
export const $PROJECT_ENUM: [boolean, boolean, 0, 1] = [true, false, 0, 1]

/**
 * @property {number[]} $SORT_ENUM - $sort query values
 */
export const $SORT_ENUM: number[] = (() => {
  const values = Object.values(SortOrder)
  return values.filter(en => typeof en === 'number') as number[]
})()

/**
 * @property {PlainObject} OPENAPI_GLOBALS - OpenAPI global constants
 */
export const OPENAPI_GLOBALS: PlainObject = {
  refs: {
    JSONValue: { $ref: '#/components/schemas/JSONValue' }
  },
  responses: {
    500: { description: 'Internal server error', type: ExceptionJSON },
    502: { description: 'Vercel hosting error' }
  },
  schemas: {
    JSONValue: {
      anyOf: [
        { nullable: true, type: 'boolean' },
        { nullable: true, type: 'number' },
        { nullable: true, type: 'object' },
        { nullable: true, type: 'string' },
        { items: { nullable: true, type: 'boolean' } },
        { items: { nullable: true, type: 'number' } },
        { items: { nullable: true, type: 'object' } },
        { items: { nullable: true, type: 'string' } }
      ]
    }
  }
}
