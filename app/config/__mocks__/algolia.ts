import { createWaitablePromise as waitable } from '@algolia/client-common'
import type {
  ChunkedBatchResponse,
  DeleteResponse,
  SearchResponse,
  SetSettingsResponse,
  Settings
} from '@algolia/client-search'
import type { SearchIndex } from 'algoliasearch'
import type { PlainObject } from 'simplytyped'

/**
 * @file Mock - algolia
 * @module app/config/mocks/algolia
 * @see https://jestjs.io/docs/next/manual-mocks#mocking-user-modules
 * @see https://github.com/algolia/algoliasearch-client-javascript
 * @see https://github.com/algolia/vue-instantsearch/issues/466
 */

const { SEARCH_INDEX_SETTINGS } = jest.requireActual('../algolia')

const INDEXES: Record<string, Partial<SearchIndex>> = {}
const OBJECTS: Record<string, PlainObject[]> = {}
const SETTINGS: Record<string, Settings> = {}

const appId = process.env.ALGOLIA_APP_ID || ''

/**
 * Initializes a mock search index.
 *
 * @param {string} indexName - Name of search index to initialize or retrieve
 * @return {Partial<SearchIndex>} Initialized search index
 */
const mockInitIndex = (indexName: string): Partial<SearchIndex> => {
  if (INDEXES[indexName]) return INDEXES[indexName]

  INDEXES[indexName] = {
    appId,
    clearObjects: jest.fn(() => {
      const response: DeleteResponse = {
        taskID: Math.floor(Math.random() * (OBJECTS[indexName]?.length + 1))
      }

      OBJECTS[indexName] = []

      return waitable(Promise.resolve(response))
    }),
    indexName,
    saveObjects: jest.fn((objects: readonly PlainObject[]) => {
      OBJECTS[indexName] = objects as PlainObject[]

      const response: ChunkedBatchResponse = {
        objectIDs: objects.map(({ objectID }) => objectID),
        taskIDs: []
      }

      return waitable(Promise.resolve(response))
    }),
    search: jest.fn(async () => {
      return { hits: OBJECTS[indexName] } as SearchResponse<PlainObject>
    }),
    setSettings: jest.fn((settings: Settings) => {
      SETTINGS[indexName] = settings

      const response: SetSettingsResponse = {
        taskID: -1,
        updatedAt: new Date().valueOf()
      }

      return waitable(Promise.resolve(response))
    })
  } as Partial<SearchIndex>

  return INDEXES[indexName]
}

export default { initIndex: jest.fn(mockInitIndex) }
export { SEARCH_INDEX_SETTINGS }
