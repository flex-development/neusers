import type { Settings } from '@algolia/client-search'
import algolia from 'algoliasearch'
import { CONF } from './configuration'

/**
 * @file Algolia Client Configuration
 * @module app/config/algolia
 * @see https://www.algolia.com/doc/api-client/getting-started
 */

export default algolia(CONF.ALGOLIA_APP_ID, CONF.ALGOLIA_API_KEY)

/**
 * Object mapping search index names to settings.
 *
 * - https://www.algolia.com/doc/api-reference/settings-api-parameters/
 */
export const SEARCH_INDEX_SETTINGS: Record<
  string,
  Settings & { name: string }
> = {
  users: {
    attributesForFaceting: [
      'email',
      'id',
      'first_name',
      'last_name',
      'objectID'
    ],
    name: 'users'
  }
}
