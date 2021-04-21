import type { IEntity as IFirestoreEntity } from 'fireorm'
import type { NumberToString } from 'simplytyped'

/**
 * @file Global Inteface - IEntity
 * @module app/subdomains/interfaces/Entity
 */

export interface IEntity extends IFirestoreEntity {
  /**
   * Date and time entity was created (ISO 8601 format).
   */
  readonly created_at: string

  /**
   * Unique identifier for the entity.
   */
  readonly id: NumberToString<number> | string
}
