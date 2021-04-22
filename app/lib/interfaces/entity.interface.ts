import type { IEntity as IFirestoreEntity } from 'fireorm'
import type { NumberToString } from 'simplytyped'

/**
 * @file Global Inteface - IEntity
 * @module app/subdomains/interfaces/Entity
 */

export interface IEntity extends IFirestoreEntity {
  /**
   * Date and time entity was created.
   *
   * - Format: [Unix Timestamp](https://en.wikipedia.org/wiki/Unix_time)
   */
  readonly created_at: number

  /**
   * Unique identifier for the entity.
   */
  readonly id: NumberToString<number> | string

  /**
   * Date and time entity was modified.
   *
   * - Format: [Unix Timestamp](https://en.wikipedia.org/wiki/Unix_time)
   */
  readonly updated_at: number | null
}
