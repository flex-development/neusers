import type { SearchOptions } from '@algolia/client-search'
import type { IEntity } from './entity.interface'

/**
 * @file Global Interfaces - SearchParams
 * @module app/lib/interfaces/SearchParams
 */

/**
 * `AlgoliaRepository` search paramaters.
 *
 * - https://www.algolia.com/doc/api-reference/api-parameters
 */
export interface SearchParams {
  /**
   * List of fields to include.
   *
   * @default ['objectID']
   */
  attributesToRetrieve?: SearchOptions['attributesToRetrieve']

  /**
   * Show objects created before a specified date.
   *
   * - Format: [Unix Timestamp](https://en.wikipedia.org/wiki/Unix_time)
   */
  created_at_max?: IEntity['created_at']

  /**
   * Show objects created after a specified date.
   *
   * - Format: [Unix Timestamp](https://en.wikipedia.org/wiki/Unix_time)
   */
  created_at_min?: IEntity['created_at']

  /**
   * Enable word segmentation (decompounding) at query time.
   */
  decompoundQuery?: SearchOptions['decompoundQuery']

  /**
   * List of fields to disable typo tolerance.
   */
  dttoa?: SearchOptions['disableTypoToleranceOnAttributes']

  /**
   * Numeric, facet and/or tag filters.
   */
  filters?: SearchOptions['filters']

  /**
   * Number of results per page; [1,Number.MAX_SAFE_INTEGER].
   */
  hitsPerPage?: SearchOptions['hitsPerPage']

  /**
   * Number of hits to retrieve; [1,1000].
   */
  length?: SearchOptions['length']

  /**
   * Find object by objectID.
   */
  objectID?: SearchOptions['filters']

  /**
   * Offset of first hit to return; [1,Number.MAX_SAFE_INTEGER].
   */
  offset?: SearchOptions['offset']

  /**
   * List of words to be considered as optional when found in `query`.
   */
  optionalWords?: SearchOptions['optionalWords']

  /**
   * Page to retrieve; [0,Number.MAX_SAFE_INTEGER].
   */
  page?: SearchOptions['page']

  /**
   * Text to search in index.
   */
  query?: SearchOptions['query']

  /**
   * List of fields the search response should contain.
   */
  responseFields?: SearchOptions['responseFields']

  /**
   * Show objects modified before a specified date.
   *
   * - Format: [Unix Timestamp](https://en.wikipedia.org/wiki/Unix_time)
   */
  updated_at_max?: IEntity['updated_at']

  /**
   * Show objects modified after a specified date.
   *
   * - Format: [Unix Timestamp](https://en.wikipedia.org/wiki/Unix_time)
   */
  updated_at_min?: IEntity['updated_at']

  /**
   * Alphanumeric user identifier; [1,64].
   */
  userToken?: SearchOptions['userToken']
}
