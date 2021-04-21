import { ExceptionStatus } from '@neusers/lib/enums/exception-status.enum'
import AppException from '@neusers/lib/exceptions/app.exception'
import type { AppExceptionJSON } from '@neusers/lib/interfaces'
import SearchParams from '@neusers/lib/models/search-params.model'
import Algolia from '../../../config/algolia'
import Subject from '../algolia.repository'
import MockEntityRepository from '../entity.repository'
import SEARCH_INDEX_404 from './__fixtures__/algolia-search-index-404.fixture'
import type { ICar } from './__fixtures__/cars.fixture'
import {
  CARS_INDEX_NAME as indexName,
  CARS_ROOT
} from './__fixtures__/cars.fixture'

/**
 * @file Unit Tests - AlgoliaRepository
 * @module app/lib/repositories/tests/AlgoliaRepository
 */

jest.mock('../../../config/algolia')
jest.mock('../entity.repository')

const mockAlgolia = Algolia as jest.Mocked<typeof Algolia>

describe('app/lib/repositories/AlgoliaRepository', () => {
  const OBJECTS = Object.values(CARS_ROOT).map(object => ({
    ...object,
    created_at: new Date().toISOString(),
    updated_at: null
  }))

  let TestSubject = {} as Subject<ICar>

  describe('exports', () => {
    it('class by default', () => {
      expect(Subject).toBeDefined()
      expect(Subject.constructor.name).toBe('Function')
    })
  })

  describe('constructor', () => {
    beforeEach(() => {
      TestSubject = new Subject<ICar>(indexName)
    })

    it('calls EntityRepository class constructor', () => {
      expect(MockEntityRepository.prototype.constructor).toBeCalledTimes(1)
    })

    it('initializes search index', () => {
      expect(mockAlgolia.initIndex).toBeCalledTimes(1)

      // @ts-expect-error testing
      expect(mockAlgolia.initIndex).toBeCalledWith(TestSubject.index_name)
    })

    it('sets oidk property', () => {
      expect(TestSubject.oidk).toBe('id')
    })

    it('sets search index settings', () => {
      // @ts-expect-error testing invocation
      const spy = jest.spyOn(TestSubject.index, 'setSettings')

      expect(spy).toBeCalledTimes(1)
      expect(spy).toBeCalledWith({})
    })

    it('clears index', () => {
      const TestSubjectI = new Subject<ICar>(indexName, 'id', true)

      // @ts-expect-error testing invocation
      expect(jest.spyOn(TestSubjectI.index, 'clearObjects')).toBeCalledTimes(1)
    })
  })

  describe('#findAll', () => {
    const TestSubject = new Subject<ICar>(indexName)

    const spyFind = jest.spyOn(MockEntityRepository.prototype, 'find')

    beforeEach(() => {
      spyFind.mockReturnValue(Promise.resolve(OBJECTS))
    })

    it('formats search params', async () => {
      const spy = jest.spyOn(TestSubject, 'searchOptions')

      await TestSubject.findAll()

      expect(spy).toBeCalledTimes(1)
      expect(spy).toBeCalledWith({})
    })

    it('calls #index.saveObjects with #objects return value', async () => {
      // @ts-expect-error testing invocation
      const spy = jest.spyOn(TestSubject.index, 'saveObjects')
      const objects = await TestSubject.objects()

      await TestSubject.findAll()

      expect(spy).toBeCalledTimes(1)

      spy.mock.calls[0][0].forEach((callobj, i) => {
        expect(callobj).toMatchObject(objects[i])
      })
    })

    it('calls #index.search', async () => {
      await TestSubject.findAll()

      // @ts-expect-error testing invocation
      expect(jest.spyOn(TestSubject.index, 'search')).toBeCalledTimes(1)
    })

    it('handles missing search index error', async () => {
      // @ts-expect-error testing
      const spy = jest.spyOn(TestSubject.index, 'search')

      spy.mockReturnValueOnce(Promise.reject(SEARCH_INDEX_404))

      const response = await TestSubject.findAll()

      expect(response).toMatchObject({
        hits: [],
        hitsPerPage: 0,
        // @ts-expect-error testing
        index: TestSubject.index_name,
        nbHits: 0,
        nbPages: 0,
        page: 0,
        query: ''
      })
    })
  })

  describe('#findOneById', () => {
    const TestSubject = new Subject<ICar>(indexName)

    const spyFind = jest.spyOn(MockEntityRepository.prototype, 'find')

    beforeEach(() => {
      spyFind.mockReturnValue(Promise.resolve(OBJECTS))
    })

    it('returns search index object', async () => {
      const object = OBJECTS[0]
      const result = await TestSubject.findOneById(object.id)

      expect(result.objectID).toBe(object.id)
    })
  })

  describe('#objects', () => {
    const TestSubject = new Subject<ICar>(indexName)

    const spyFind = jest.spyOn(MockEntityRepository.prototype, 'find')

    it('adds objectID property to each object using current oidk', async () => {
      spyFind.mockReturnValue(Promise.resolve(OBJECTS))

      const objs = await TestSubject.objects()

      objs.forEach(obj => expect(obj.objectID).toBe(obj[TestSubject.oidk]))
    })

    it('handles error if #find throws', async () => {
      const error = new Error('Test')

      spyFind.mockReturnValue(Promise.reject(error))

      let exception = {} as AppException

      try {
        await TestSubject.objects()
      } catch (error) {
        exception = error
      }

      expect(exception.constructor.name).toBe('AppException')

      const ejson = exception.getResponse() as AppExceptionJSON

      expect(ejson.code).toBe(ExceptionStatus.INTERNAL_SERVER_ERROR)
      expect(ejson.data).toMatchObject({
        // @ts-expect-error testing
        index_name: TestSubject.index_name,
        oidk: TestSubject.oidk
      })
      expect(ejson.message).toBe(error.message)
    })
  })

  describe('#searchOptions', () => {
    const { DSO } = Subject

    const TestSubject = new Subject<ICar>(indexName)

    const duplicatesarr = ['foo', 'foo']

    it('formats params.attributesToRetrieve', () => {
      const options = TestSubject.searchOptions({
        attributesToRetrieve: duplicatesarr
      })

      const expectedarr = DSO.attributesToRetrieve?.concat([duplicatesarr[0]])
      const expected = expect.arrayContaining(expectedarr || [])

      expect(options.attributesToRetrieve).toEqual(expected)
    })

    it('formats params.disableTypoToleranceOnAttributes', () => {
      const options = TestSubject.searchOptions({
        disableTypoToleranceOnAttributes: duplicatesarr
      })

      const expected = expect.arrayContaining([duplicatesarr[0]])

      expect(options.disableTypoToleranceOnAttributes).toEqual(expected)
    })

    it('formats params.filters', () => {
      const params = { filters: 'prop:foo prop:foo' }

      const options = TestSubject.searchOptions(params)

      expect(options.filters).toBe(params.filters.split(' ')[0])
    })

    it('formats params.hitsPerPage', () => {
      const params = ({ hitsPerPage: '0' } as unknown) as SearchParams

      const options = TestSubject.searchOptions(params)

      expect(options.hitsPerPage).toBe(1)
    })

    it('formats params.length', () => {
      const params = ({ length: '-2' } as unknown) as SearchParams

      const options = TestSubject.searchOptions(params)

      expect(options.length).toBe(1)
    })

    it('formats params.objectID', () => {
      const params = { objectID: OBJECTS[0].id }

      const options = TestSubject.searchOptions(params)

      expect(options.filters).toBe(`objectID:${params.objectID}`)
    })

    it('formats params.offset', () => {
      const params = ({ offset: '-1' } as unknown) as SearchParams

      const options = TestSubject.searchOptions(params)

      expect(options.offset).toBe(0)
    })

    it('formats params.optionalWords', () => {
      const options = TestSubject.searchOptions({
        optionalWords: duplicatesarr
      })

      const expected = expect.arrayContaining([duplicatesarr[0]])

      expect(options.optionalWords).toEqual(expected)
    })

    it('formats params.page', () => {
      const params = { page: -1 }

      const options = TestSubject.searchOptions(params)

      expect(options.page).toBe(params.page * -1 - 1)
    })

    it('formats params.query', () => {
      const params = { query: 'QUERYSTRING' }

      const options = TestSubject.searchOptions(params)

      expect(options.query).toBe(params.query.toLowerCase())
    })

    it('formats and merges additional search params', () => {
      const duplicatesarr2 = ['prop', 'prop']

      const params = { attributesToRetrieve: duplicatesarr }
      const aoptions = { attributesToRetrieve: duplicatesarr2 }

      const options = TestSubject.searchOptions(params, aoptions)

      let expectedarr = DSO.attributesToRetrieve?.concat([duplicatesarr[0]])
      expectedarr = expectedarr?.concat([duplicatesarr2[1]])

      const expected = expect.arrayContaining(expectedarr || [])

      expect(options.attributesToRetrieve).toEqual(expected)
    })
  })
})