import { BaseFirestoreRepository as MockBaseRepo } from 'fireorm'
import Algolia from '../../../config/algolia'
import Subject from '../algolia.repository'
import type { ICar } from './__fixtures__/cars.fixture'
import { CARS_INDEX_NAME as indexName } from './__fixtures__/cars.fixture'

/**
 * @file Unit Tests - AlgoliaRepository
 * @module app/lib/repositories/tests/AlgoliaRepository
 */

jest.mock('fireorm/lib/src/BaseFirestoreRepository')
jest.mock('../../../config/algolia')

const mockAlgolia = Algolia as jest.Mocked<typeof Algolia>

describe('app/lib/repositories/AlgoliaRepository', () => {
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

    it('calls BaseFirestoreRepository class constructor', () => {
      expect(MockBaseRepo.prototype.constructor).toBeCalledTimes(1)
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

  describe('#create', () => {
    it.todo('timestamps entity')

    it.todo('assigns id if dto.id is nullable')

    it.todo('calls super.create')

    it.todo('throws 400 if object with dto.id already exists')
  })

  describe('#delete', () => {
    it.todo('throws if object does not exist')

    it.todo('calls super.delete')
  })

  describe('#findAll', () => {
    it.todo('formats search params')

    it.todo('calls #index.saveObjects with #objects return value')

    it.todo('calls #index.search')

    it.todo('handles missing search index error')
  })

  describe('#findOneById', () => {
    it.todo('returns search index object')

    it.todo('throws 404 if object does not exist')
  })

  describe('#objects', () => {
    it.todo('adds objectID property to each object using current oidk')

    it.todo('handles error if #find throws')
  })

  describe('#searchOptions', () => {
    it.todo('formats params.attributesToRetrieve')

    it.todo('formats params.disableTypoToleranceOnAttributes')

    it.todo('formats params.filters')

    it.todo('formats params.hitsPerPage')

    it.todo('formats params.length')

    it.todo('formats params.objectID')

    it.todo('formats params.offset')

    it.todo('formats params.optionalWords')

    it.todo('formats params.page')

    it.todo('formats params.query')
  })

  describe('#patch', () => {
    it.todo('throws if object does not exist')

    it.todo('removes readonly fields from dto')

    it.todo('calls #update')
  })
})
