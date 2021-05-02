import type { SearchOptions, Settings } from '@algolia/client-search'
import { ExceptionStatusCode } from '@flex-development/exceptions/enums'
import type { SearchIndex } from 'algoliasearch'
import clamp from 'lodash/clamp'
import isEmpty from 'lodash/isEmpty'
import isUndefined from 'lodash/isUndefined'
import join from 'lodash/join'
import omit from 'lodash/omit'
import pick from 'lodash/pick'
import uniq from 'lodash/uniq'
import Algolia, { SEARCH_INDEX_SETTINGS } from '../../config/algolia'
import { CONF } from '../../config/configuration'
import '../../config/database'
import AppException from '../exceptions/app.exception'
import type { IEntity } from '../interfaces'
import type { SearchParams } from '../interfaces/search-params.interface'
import type {
  OrNever,
  SearchResponseRepo as SearchResponse,
  WithOID
} from '../types'
import EntityRepository from './entity.repository'

/**
 * @file Global Repository - AlgoliaRepository
 * @module app/lib/repositories/Algolia
 */

/**
 * Integrates Algolia Search client and the `EntityRepository` base class, an
 * extension of `BaseFirestoreRepository` from Fireorm.
 *
 * @see https://www.algolia.com/doc/api-reference/api-parameters/
 * @see https://fireorm.js.org
 *
 * @template TO - Shape of search index object (repo model interface)
 * @template P - Shape of search parameters
 *
 * @class
 * @extends EntityRepository
 */
export default class AlgoliaRepository<
  TO extends IEntity = IEntity,
  P extends SearchParams = SearchParams
> extends EntityRepository<TO> {
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
   * Instantiates an `EntityRepostitory` compatiable with Algolia Search client.
   *
   * The search index name will be prefixed with the Node environment followed
   * by an underscore (_).
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
   * Executes a search against the index.
   *
   * @async
   * @param {P} [params] - Search index options
   * @return {Promise<SearchResponse<TO>>} Promise containing search response
   * @throws {AppException}
   */
  async findAll(params: P = {} as P): OrNever<Promise<SearchResponse<TO>>> {
    const responseFields = AlgoliaRepository.DSO.responseFields as string[]

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
      if (status === ExceptionStatusCode.NOT_FOUND) {
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
   * @param {P} params - Search index parameters
   * @return {Promise<Partial<WithOID<TO>>>} Promise containing resource
   * @throws {AppException}
   */
  async findOneById(
    objectID: TO['id'],
    params: P = {} as P
  ): OrNever<Promise<Partial<WithOID<TO>>>> {
    // Check if object exists as entity
    await this.get(objectID)

    return (await this.findAll({ ...params, objectID })).hits[0]
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
   * - MSI = Number.MAX_SAFE_INTEGER
   *
   * @see https://www.algolia.com/doc/api-reference/api-parameters
   *
   * @param {SearchParams} [params] - Search index parameters
   * @param {string[]} [params.attributesToRetrieve] - List of fields to include
   * @param {number} [params.created_at_max] - Objects created before date
   * @param {number} [params.created_at_min] - Objects created after date
   * @param {boolean} [params.decompoundQuery] - Enable word segmentation
   * @param {boolean} [params.dttoa] - List of fields to disable typo tolerance
   * @param {string} [params.filters] - Numeric, facet and/or tag filters
   * @param {number} [params.hitsPerPage] - Number of results per page
   * @param {number} [params.length] - Number of hits to retrieve; [1,1000]
   * @param {string} [params.objectID] - Find object by objectID
   * @param {number} [params.offset] - Offset of first hit to return; [1,MSI]
   * @param {string[]} [params.optionalWords] - List of words that should be
   * considered as optional when found in the query
   * @param {number} [params.page] - Page to retrieve; [0,MSI]
   * @param {number} [params.query] - Text to search in index
   * @param {number} [params.updated_at_max] - Objects modified before date
   * @param {number} [params.updated_at_min] - Objects modified after date
   * @param {string} [params.userToken] - Alphanumeric user identifier; [1,64]
   * @return {SearchOptions} Formatted Algolia search options object
   */
  searchOptions(params: SearchParams = {}): SearchOptions {
    const {
      attributesToRetrieve: fields = [],
      created_at_max,
      created_at_min,
      dttoa,
      filters = '',
      hitsPerPage: hits = null,
      length = null,
      objectID,
      offset = null,
      optionalWords,
      page = null,
      query = '',
      updated_at_max,
      updated_at_min,
      ...rest
    } = params

    const MSI = Number.MAX_SAFE_INTEGER

    // Update default attributes to retrieve
    let attributesToRetrieve = AlgoliaRepository.DSO.attributesToRetrieve || []
    attributesToRetrieve = uniq(attributesToRetrieve.concat(fields))

    // Initialize search filters array
    const filtersarr: string[] = filters.split(' ')

    // Add created_at_max filter
    if (created_at_max) filtersarr.push(`created_at < ${created_at_max}`)

    // Add created_at_min filter
    if (created_at_min) filtersarr.push(`created_at > ${created_at_min}`)

    // Add objectID filter
    if (!isEmpty(objectID)) filtersarr.push(`objectID:${objectID}`)

    // Add created_at_max filter
    if (updated_at_max) filtersarr.push(`updated_at < ${updated_at_max}`)

    // Add created_at_min filter
    if (updated_at_min) filtersarr.push(`updated_at > ${updated_at_min}`)

    // Format offset
    const $o = length && !offset ? 0 : offset

    return {
      ...AlgoliaRepository.DSO,
      ...rest,
      attributesToRetrieve,
      disableTypoToleranceOnAttributes: dttoa ? uniq(dttoa) : undefined,
      filters: join(uniq(filtersarr), ' ').trim(),
      hitsPerPage: hits ? clamp(JSON.parse(`${hits}`), 1, MSI) : undefined,
      length: length ? clamp(JSON.parse(`${length}`), 1, 1000) : undefined,
      offset: !isUndefined($o) ? clamp(JSON.parse(`${$o}`), 0, MSI) : undefined,
      optionalWords: optionalWords ? uniq(optionalWords) : undefined,
      page: page ? clamp(JSON.parse(`${page}`), 0, MSI) : undefined,
      query: !isEmpty(query) ? query.toLowerCase() : undefined
    }
  }
}
