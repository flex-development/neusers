import type { OneOrMany } from '@flex-development/dreepo'
import { ExceptionStatusCode } from '@flex-development/exceptions'
import type { SchemaObjectMetadata } from '@nestjs/swagger/dist/interfaces/schema-object-metadata.interface'
import type { PlainObject } from 'simplytyped'

/**
 * @file Global Type Definitions
 * @module app/lib/types
 */

/**
 * JSON response from an `HttpException`.
 */
export interface HttpExceptionJSON {
  message: string
  statusCode: ExceptionStatusCode
}

/**
 * Type of value wrapped by inteceptor observables.
 */
export type InterceptorResponse<T = PlainObject> = OneOrMany<T> | void

/**
 * Object containing Swagger schema object metdata for any object schema.
 *
 * References:
 *
 * - https://docs.nestjs.com/openapi/types-and-parameters
 *
 * @template S - Schema type
 */
export type SchemaMetadata<S extends PlainObject = PlainObject> = Record<
  keyof S,
  SchemaObjectMetadata
>
