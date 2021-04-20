import type { NumberToString } from 'simplytyped'

/**
 * @file Global Inteface - Entity
 * @module app/subdomains/interfaces/Entity
 */

export interface Entity {
  /**
   * Date and time entity was created (ISO 8601 format).
   */
  readonly created_at: string

  /**
   * Unique identifier for the entity.
   */
  readonly uid: NumberToString<number> | string
}