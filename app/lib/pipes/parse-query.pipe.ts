import type { IEntity, QueryParams } from '@flex-development/dreepo'
import { ExceptionStatusCode } from '@flex-development/exceptions/enums'
import Exception from '@flex-development/exceptions/exceptions/base.exception'
import type { ArgumentMetadata, PipeTransform } from '@nestjs/common'
import { Injectable } from '@nestjs/common'
import type { VercelRequestQuery } from '@vercel/node'
import isPlainObject from 'lodash.isplainobject'
import omit from 'lodash.omit'
import isJSON from 'validator/lib/isJSON'

/**
 * @file Global Pipe - ParseQueryPipe
 * @module app/lib/pipes/ParseQueryPipe
 */

/**
 * Global pipe to parse query parameters.
 *
 * @template E - Entity
 *
 * @class
 * @implements {PipeTransform<any, QueryParams<E> | any>}
 */
@Injectable()
export default class ParseQueryPipe<E extends IEntity = IEntity>
  implements PipeTransform<any, QueryParams<E> | any> {
  /**
   * Uses `JSON.parse` to parse each key of {@param value} if it's a string
   * containing JSON data.
   *
   * If {@param metadata.type} equals `query`, the original value will be
   * returned without an attempt to be parsed.
   *
   * This is useful for methods that use query parameters, but don't take into
   * account that queries are `VercelRequestQuery` objects, where all key values
   * are actually strings.
   *
   * Additionally, {@param value.path} will be deleted. With every request to a
   * serverless function running on Vercel, the request path is sent as a query
   * parameter. When a search is executed, this will cause the search to yield
   * zero results.
   *
   * @param {any} value - Value before it goes to route handler method
   * @param {ArgumentMetadata} metadata - Pipe metadata about @param value
   * @return {QueryParams<E> | any} Entity query parameters, original value, or
   * value of `query[metadata.data]`
   * @throws {Exception}
   */
  transform(value: any, metadata: ArgumentMetadata): QueryParams<E> | any {
    if (metadata.type !== 'query') return value

    let query: QueryParams<E> = {}

    if (value && !isPlainObject(value)) {
      const message = `Query parameters must be an object; received ${value}`
      const data = { errors: { value } }

      throw new Exception(ExceptionStatusCode.BAD_REQUEST, message, data)
    }

    Object.keys((value || {}) as VercelRequestQuery).forEach(key => {
      let key_value = value[key]

      if (typeof key_value === 'string') {
        // @ts-expect-error type definition is wrong
        const json = isJSON(key_value, { allow_primitives: true })

        key_value = json ? JSON.parse(key_value) : key_value
      }

      query[key] = key_value
    })

    query = omit(query, ['path'])

    return typeof metadata.data === 'string' ? query[metadata.data] : query
  }
}
