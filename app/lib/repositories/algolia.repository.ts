import type { SearchOptions, Settings } from '@algolia/client-search'
import type { SearchIndex } from 'algoliasearch'
import type { PartialBy } from 'fireorm'
import { BaseFirestoreRepository as Repo } from 'fireorm'
import { isPlainObject } from 'lodash'
import clamp from 'lodash/clamp'
import isEmpty from 'lodash/isEmpty'
import isUndefined from 'lodash/isUndefined'
import join from 'lodash/join'
import merge from 'lodash/merge'
import omit from 'lodash/omit'
import pick from 'lodash/pick'
import uniq from 'lodash/uniq'
import Algolia, { SEARCH_INDEX_SETTINGS } from '../../config/algolia'
import { CONF } from '../../config/configuration'
import '../../config/database'
import { ExceptionStatus } from '../enums/exception-status.enum'
import AppException from '../exceptions/app.exception'
import type { IEntity as IE } from '../interfaces'
import SearchParams from '../models/search-params.model'
import type {
  OrNever,
  SearchResponseRepo as SearchResponse,
  WithOID
} from '../types'

/**
 * @file Global Repository - AlgoliaRepository
 * @module app/lib/repositories/Algolia
 */

/**
 * Integrates the Algolia Search client and Fireorm.
 *
 * @see https://www.algolia.com/doc/api-reference/api-parameters/
 * @see https://fireorm.js.org
 *
 * @template TO - Shape of search index object (repository model interface)
 *
 * @class
 * @extends Repo
 */
export default class AlgoliaRepository<TO extends IE = IE> extends Repo<TO> {
  /**
   * @property {SearchOptions} DSO - Default search options
   */
  static DSO: SearchOptions = {
    attributesToHighlight: [],
    attributesToRetrieve: ['objectID'],
    attributesToSnippet: [],
    responseFields: [
      'hits',
      'hitsPerPage',
      'index',
      'length',
      'nbHits',
      'nbPages',
      'offset',
      'page',
      'query',
      'userData'
    ]
  }

  /**
   * @property {string} ENV - Node environment
   */
  static ENV: string = CONF.NODE_ENV

  /**
   * @protected
   * @property {SearchIndex} index - Algolia search index object
   */
  protected index: SearchIndex

  /**
   * @protected
   * @property {string} index_name - Name of the search index
   */
  protected index_name: string

  /**
   * @protected
   * @property {Settings} settings - Search index settings
   */
  protected settings: Settings = {}

  /**
   * @property {string} oidk - Name of field to set `objectID` value
   */
  oidk: keyof TO

  /**
   * Instantiates a Firestore repository compatiable with Algolia Search client.
   *
   * The search index name (and subsequent repository path), {@param name}, will
   * be prefixed with the Node environment followed by an underscore (_).
   *
   * @param {string} name - Name of search index to initialize
   * @param {string} oidk - Name of key to use when setting objectID
   * @param {boolean} [clear] - Clear index objects after updating index
   * settings. Defaults to `false`
   */
  constructor(name: string, oidk: keyof TO = 'id', clear: boolean = false) {
    super(`${AlgoliaRepository.ENV}_${name}`)

    this.index_name = this.path
    this.index = Algolia.initIndex(this.index_name)
    this.oidk = oidk
    this.settings = omit(SEARCH_INDEX_SETTINGS[name] || {}, ['name'])

    // Update settings and clear search index
    this.index.setSettings(this.settings).wait()
    if (clear) this.index.clearObjects().wait()
  }

  /**
   * Creates a new entity and updates the search index.
   *
   * The entity will be timestamped and assigned an `id` if not present.
   *
   * @async
   * @param {PartialBy<TO, 'id'>} dto - Data to create new entity
   * @return {Promise<TO>} Promise containing new entity
   * @throws {AppException}
   */
  async create(dto: PartialBy<TO, 'id'>): OrNever<Promise<TO>> {
    throw new AppException(
      ExceptionStatus.NOT_IMPLEMENTED,
      'Method not implemented'
    )
  }

  /**
   * Deletes an entity and updates the search index.
   *
   * @async
   * @param {string} objectID - objectID of resource to delete
   * @return {Promise<void>} Nothing when complete
   * @throws {AppException}
   */
  async delete(objectID: TO['id']): OrNever<Promise<void>> {
    throw new AppException(
      ExceptionStatus.NOT_IMPLEMENTED,
      'Method not implemented'
    )
  }

  /**
   * Executes a search against the index.
   *
   * @async
   * @param {SearchParams} [params] - Search index options
   * @return {Promise<SearchResponse<TO>>} Promise containing searchr response
   * @throws {AppException}
   */
  async findAll(
    params: SearchParams = {}
  ): OrNever<Promise<SearchResponse<TO>>> {
    const { responseFields = [] } = AlgoliaRepository.DSO

    // Format search options
    const options = this.searchOptions(params)

    try {
      // Save search index objects
      this.index.saveObjects(await this.objects()).wait()

      // Perform search
      const res = await this.index.search<TO>(options?.query ?? '', options)

      // Return response
      return pick(res, responseFields) as SearchResponse<TO>
    } catch (err) {
      const { message, status = 500 } = err

      // Check for missing search index error
      if (status === ExceptionStatus.NOT_FOUND) {
        const message_s_pass = message?.toLowerCase().startsWith('index')
        const message_e_pass = message?.toLowerCase().endsWith('does not exist')

        if (message_s_pass && message_e_pass) {
          return {
            hits: [],
            hitsPerPage: 0,
            index: this.index_name,
            nbHits: 0,
            nbPages: 0,
            page: 0,
            query: options.query || ''
          }
        }
      }

      // Build error data object
      const data = { index_name: this.index_name, options }

      throw new AppException(status, message, data)
    }
  }

  /**
   * Retrieve a single search index resource by `objectID`.
   *
   * @async
   * @param {string} objectID - objectID of resource to retrieve
   * @param {SearchParams} params - Search index options
   * @param {string[]} [params.attributesToRetrieve] - List of fields to include
   * @param {string} [params.userToken] - User identifier
   * @return {Promise<Partial<WithOID<TO>>>} Promise containing resource
   * @throws {AppException}
   */
  async findOneById(
    objectID: TO['id'],
    params: Pick<SearchParams, 'attributesToRetrieve' | 'userToken'> = {}
  ): OrNever<Promise<Partial<WithOID<TO>>>> {
    const $params = pick(params, ['attributesToRetrieve', 'userToken'])

    const { hits } = await this.findAll({ ...pick($params), objectID })
    const object = hits[0]

    if (!object || object.objectID !== objectID) {
      const data = { errors: { objectID }, params: $params }
      const message = `Object with objectID "${objectID}" not found`

      throw new AppException(404, message, data)
    }

    return object
  }

  /**
   * Returns an array of objects populate the search index; each object will
   * have an `objectID` field attached.
   *
   * @async
   * @return {Promise<Array<WithOID<TO>>>} Promise containing
   * initial index objects with additional objectID property
   * @throws {AppException}
   */
  async objects(): OrNever<Promise<WithOID<TO>[]>> {
    try {
      const objects = await this.find()
      return objects.map(obj => ({ ...obj, objectID: `${obj[this.oidk]}` }))
    } catch (err) {
      throw new AppException(err?.status ?? 500, err.message, {
        index_name: this.index_name,
        oidk: this.oidk
      })
    }
  }

  /**
   * Formats an Algolia search options object.
   *
   * @see https://www.algolia.com/doc/api-reference/api-parameters/filters/
   *
   * @param {SearchParams} [params] - Search index options
   * @param {string[]} [params.attributesToRetrieve] - List of fields to include
   * @param {boolean} [params.decompoundQuery] - Enable word segmentation
   * @param {boolean} [params.disableTypoToleranceOnAttributes] - List of
   * attributes on to disable typo tolerance
   * @param {string} [params.filters] - Filter the query with numeric, facet
   * and/or tag filters
   * @param {number} [params.hitsPerPage] - Number of results per page
   * @param {number} [params.length] - Result limit (used only with offset)
   * @param {string} [params.objectID] - Find object by objectID
   * @param {number} [params.offset] - Offset of the first result to return
   * @param {string[]} [params.optionalWords] - List of words that should be
   * considered as optional when found in the query
   * @param {number} [params.page] - Specify the page to retrieve
   * @param {number} [params.query] - Text to search in index
   * @param {string} [params.userToken] - User identifier
   * @param {SearchOptions} [aoptions] - Additonal options to merge
   * @return {SearchOptions} Formatted Algolia search options object
   */
  searchOptions(
    params: SearchParams = {},
    aoptions?: SearchOptions
  ): SearchOptions {
    const {
      attributesToRetrieve: fields = [],
      disableTypoToleranceOnAttributes: dTTOA,
      filters = '',
      hitsPerPage: hits = null,
      length = null,
      objectID,
      offset: o = null,
      optionalWords,
      page = null,
      query = '',
      ...rest
    } = params

    const MAX = Number.MAX_SAFE_INTEGER

    // Update default attributes to retrieve
    let attributesToRetrieve = AlgoliaRepository.DSO.attributesToRetrieve || []
    attributesToRetrieve = uniq(attributesToRetrieve.concat(fields))

    // Initialize search filters array
    const filtersarr: string[] = filters.split(' ')

    // Add objectID filter
    if (!isEmpty(objectID)) filtersarr.push(`objectID:${objectID}`)

    // Build base options object
    let options = {
      ...AlgoliaRepository.DSO,
      ...rest,
      attributesToRetrieve,
      disableTypoToleranceOnAttributes: dTTOA ? uniq(dTTOA) : undefined,
      filters: join(uniq(filtersarr), ' '),
      hitsPerPage: hits ? clamp(JSON.parse(`${hits}`), 1, MAX) : undefined,
      length: length ? clamp(JSON.parse(`${length}`), 1, MAX) : undefined,
      offset: !isUndefined(o) ? clamp(JSON.parse(`${o}`), 0, MAX) : undefined,
      optionalWords: optionalWords ? uniq(optionalWords) : undefined,
      page: page ? clamp(JSON.parse(`${page}`), 1, MAX) : undefined,
      query: !isEmpty(query) ? query.toLowerCase() : undefined
    }

    // Format and merge options
    if (isPlainObject(aoptions)) {
      options = merge(options, this.searchOptions(aoptions))
    }

    return options
  }

  /**
   * Partially updates an entity and updates the search index.
   * The entity's `created_at` and `id` properties cannot be patched.
   *
   * @async
   * @param {string} objectID - objectID of resource to update
   * @param {PartialBy<TO, 'created_at' | 'id'>} dto - Data to patch entity
   * @param {string[]} [rfields] - Additional readonly fields
   * @return {Promise<TO>} Promise containing updated entity
   * @throws {AppException}
   */
  async patch(
    objectID: TO['id'],
    dto: PartialBy<TO, 'created_at' | 'id'>,
    rfields: string[] = []
  ): OrNever<Promise<TO>> {
    throw new AppException(
      ExceptionStatus.NOT_IMPLEMENTED,
      'Method not implemented'
    )
  }
}
