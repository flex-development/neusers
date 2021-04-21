import type { SearchOptions, SearchResponse } from '@algolia/client-search'
import type { PartialBy } from 'fireorm'
import type { PlainObject } from 'simplytyped'
import type { ExceptionStatus } from './enums/exception-status.enum'

/**
 * @file Global Type Definitions
 * @module app/lib/types
 */

/**
 * Shape of `AppExceptionJSON` `errors` property.
 */
export type AppExceptionErrors = PlainObject | (PlainObject | string)[]

/**
 * Type representing an empty object.
 */
export type EmptyObject = Record<never, never>

/**
 * Base data transfer object for entities.
 */
export type EntityDTO<E extends PlainObject = PlainObject> = PartialBy<
  E,
  EntityReadonlyProps
>

/**
 * Readonly properties of all entities. These properties can only be updated
 * internally by the `EntityRepository` class.
 */
export type EntityReadonlyProps = 'created_at' | 'id' | 'updated_at'

/**
 * JSON response from an `HttpException`.
 */
export interface HttpExceptionJSON {
  message: string
  statusCode: ExceptionStatus
}

/**
 * Type representing a `number` or `string`.
 */
export type NumberString = number | string

/**
 * Represents data returned by a function, or the return type of a function that
 * never returns a value because an error was thrown.
 */
export type OrNever<T = any> = T | never

/**
 * Type representing an asynchronous or synchronous value.
 */
export type OrPromise<T = any> = T | Promise<T>

/**
 * Function to populate search index.
 */
export type SearchIndexObjectsFN<TObject = PlainObject> = {
  (): OrNever<OrPromise<TObject[]>>
}

/**
 * Algolia search options with mandatory `userToken` property.
 */
export type SearchOptionsA = Omit<SearchOptions, 'userToken'> & {
  userToken: NonNullable<SearchOptions['userToken']>
}

/**
 * Shape of response objects from the `AlgoliaRepository` class after an index
 * search is completed.
 */
export type SearchResponseRepo<TObject = PlainObject> = Pick<
  SearchResponse<TObject>,
  | 'hits'
  | 'hitsPerPage'
  | 'index'
  | 'length'
  | 'nbHits'
  | 'nbPages'
  | 'offset'
  | 'page'
  | 'query'
  | 'userData'
>

/**
 * Object with `objectID` property.
 */
export type WithOID<TObject = PlainObject> = TObject & { objectID: string }
