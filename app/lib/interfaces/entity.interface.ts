/**
 * @file Global Interface - IEntity
 * @module app/subdomains/interfaces/Entity
 */

export interface IEntity {
  /**
   * Date and time entity was created.
   *
   * - Format: [Unix Timestamp](https://en.wikipedia.org/wiki/Unix_time)
   */
  readonly created_at: number

  /**
   * Unique identifier for the entity.
   */
  readonly id: string

  /**
   * Date and time entity was modified.
   *
   * - Format: [Unix Timestamp](https://en.wikipedia.org/wiki/Unix_time)
   */
  readonly updated_at?: number
}
