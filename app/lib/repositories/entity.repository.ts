import { BaseFirestoreRepository as BFR } from 'fireorm'
import merge from 'lodash/merge'
import omit from 'lodash/omit'
import uniq from 'lodash/uniq'
import { v4 as uuid } from 'uuid'
import { CONF } from '../../config/configuration'
import '../../config/database'
import { ExceptionStatus } from '../enums/exception-status.enum'
import AppException from '../exceptions/app.exception'
import type { IEntity as IE } from '../interfaces'
import type { EntityDTO, OrNever } from '../types'

/**
 * @file Global Repository - EntityRepository
 * @module app/lib/repositories/Entity
 */

/**
 * Extends the `BaseFirestoreRepository` class from Fireorm.
 * Adds additional logic before creating, updating, or deleting entities.
 *
 * To be used in lieu of `BaseFirestoreRepository`.
 *
 * References:
 *
 * - https://fireorm.js.org
 *
 * @template E - Shape of srepository model interface
 *
 * @class
 * @extends Repo
 */
export default class EntityRepository<E extends IE = IE> extends BFR<E> {
  /**
   * @property {string} ENV - Node environment
   */
  static ENV: string = CONF.NODE_ENV

  /**
   * Instantiates a Firestore repository.
   *
   * The repository path, {@param path}, will be prefixed with the Node
   * environment followed by an underscore (_).
   *
   * @param {string} path - Repository path
   */
  constructor(path: string) {
    super(`${EntityRepository.ENV}_${path}`)

    Object.assign(this, {
      config: {
        ...(this.config || {}),
        validatorOptions: {
          enableDebugMessages: true,
          forbidUnknownValues: true,
          stopAtFirstError: false,
          validationError: { target: false, value: true }
        }
      }
    })
  }

  /**
   * Creates a new entity.
   * The entity will be timestamped and assigned an UUID.
   *
   * @async
   * @param {EntityDTO<E>} dto - Data to create new entity
   * @return {Promise<E>} Promise containing new entity
   * @throws {AppException}
   */
  // @ts-expect-error need more flexible type definition
  async create(dto: EntityDTO<E>): OrNever<Promise<E>> {
    const $dto = merge(dto, {
      created_at: new Date().toISOString(),
      id: uuid(),
      updated_at: null
    })

    try {
      await super.create($dto as E)
    } catch (error) {
      let status = ExceptionStatus.INTERNAL_SERVER_ERROR
      let message = error?.message ?? 'Unknown error'
      let data = { ...$dto }

      if (Array.isArray(error)) {
        status = ExceptionStatus.BAD_REQUEST
        message = `Validation errors: [${error.map(e => e.property)}]`
        data = merge(data, { errors: error })
      } else if (error.message.includes(`document with id`)) {
        status = ExceptionStatus.BAD_REQUEST
        message = `Entity with id "${$dto.id}" already exists`
        data = merge(data, { errors: { id: $dto.id } })
      }

      throw new AppException(status, message, data)
    }

    return $dto as E
  }

  /**
   * Deletes an entity.
   * Throws a `404 NOT_FOUND` error if the entity isn't found.
   *
   * @async
   * @param {string} id - ID of resource to delete
   * @return {Promise<void>} Nothing when complete
   * @throws {AppException}
   */
  async delete(id: E['id']): OrNever<Promise<void>> {
    return await super.delete((await this.get(id)).id)
  }

  /**
   * Retrieves an entity by ID.
   * Throws a `404 NOT_FOUND` error if the entity isn't found.
   *
   * @param {string} id - ID of resource to retrieve
   * @return {Promise<E>} Promise containing entity
   * @throws {AppException}
   */
  async get(id: E['id']): OrNever<Promise<E>> {
    const found = await this.findById(id)

    if (!found) {
      const data = { errors: { id } }
      const message = `Entity with id "${id}" does not exist`

      throw new AppException(ExceptionStatus.NOT_FOUND, message, data)
    }

    return found
  }

  /**
   * Partially updates an entity.
   * The entity's `created_at` and `id` properties cannot be patched.
   *
   * Throws a `404 NOT_FOUND` error if the entity isn't found.
   *
   * @async
   * @param {string} id - ID of resource to update
   * @param {EntityDTO<E>} dto - Data to patch entity
   * @param {string[]} [rfields] - Additional readonly fields
   * @return {Promise<E>} Promise containing updated entity
   * @throws {AppException}
   */
  async patch(
    id: E['id'],
    dto: EntityDTO<E>,
    rfields: string[] = []
  ): OrNever<Promise<E>> {
    const entity = await this.get(id)

    // Remove readonly properties from data object
    const $rfields = uniq(['created_at', 'id', 'updated_at'].concat(rfields))

    // Merge existing data and update `updated_at` timestamp
    const $dto = {
      ...entity,
      ...merge(omit(dto, $rfields), { updated_at: new Date().toISOString() })
    }

    try {
      return await this.update($dto)
    } catch (error) {
      let status = ExceptionStatus.INTERNAL_SERVER_ERROR
      let message = error?.message ?? 'Unknown error'

      /* eslint-disable-next-line sort-keys */
      let data = { id, dto: $dto }

      if (Array.isArray(error)) {
        status = ExceptionStatus.BAD_REQUEST
        message = `Validation errors: [${error.map(e => e.property)}]`
        data = merge(data, { errors: error })
      }

      throw new AppException(status, message, data)
    }
  }
}
