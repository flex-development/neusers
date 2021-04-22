import { ExceptionStatus } from '@neusers/lib/enums/exception-status.enum'
import AppException from '@neusers/lib/exceptions/app.exception'
import type { AppExceptionJSON } from '@neusers/lib/interfaces'
import { BaseFirestoreRepository as BFR } from 'fireorm'
import type { PlainObject } from 'simplytyped'
import { v4 as uuid } from 'uuid'
import Subject from '../entity.repository'
import type { ICar } from './__fixtures__/cars.fixture'
import {
  CARS_INDEX_NAME as CARS_REPO_PATH,
  CARS_ROOT
} from './__fixtures__/cars.fixture'
import VALIDATION_ERRORS from './__fixtures__/validation-errors.fixture'

/**
 * @file Unit Tests - EntityRepository
 * @module app/lib/repositories/tests/EntityRepository
 */

jest.mock('fireorm/lib/src/BaseFirestoreRepository')

const MockBFR = BFR as jest.MockedClass<typeof BFR>

describe('app/lib/repositories/EntityRepository', () => {
  const ENTITIES = Object.values(CARS_ROOT)

  const entity = ENTITIES[0]

  const mockEntity = {
    ...entity,
    created_at: Date.now(),
    updated_at: null
  }

  describe('exports', () => {
    it('class by default', () => {
      expect(Subject).toBeDefined()
      expect(Subject.constructor.name).toBe('Function')
    })
  })

  describe('constructor', () => {
    it('calls BaseFirestoreRepository class constructor', () => {
      new Subject<ICar>(CARS_REPO_PATH)

      expect(MockBFR.prototype.constructor).toBeCalledTimes(1)
    })
  })

  describe('#create', () => {
    const TestSubject = new Subject<ICar>(CARS_REPO_PATH)

    const spy = jest.spyOn(MockBFR.prototype, 'create')

    it('timestamps entity and assigns uuid', async () => {
      await TestSubject.create(entity)

      expect(spy).toBeCalledTimes(1)

      expect(spy.mock.calls[0][0].created_at).toBeDefined()
      expect(spy.mock.calls[0][0].id).toBeDefined()
      expect(spy.mock.calls[0][0].updated_at).toBeDefined()
    })

    it('throws 400 if dto schema is invalid', async () => {
      let exception = {} as AppException

      spy.mockReturnValue(Promise.reject(VALIDATION_ERRORS))

      try {
        await TestSubject.create(entity)
      } catch (error) {
        exception = error
      }

      expect(exception.constructor.name).toBe('AppException')

      const ejson = exception.getResponse() as AppExceptionJSON

      expect(ejson.code).toBe(ExceptionStatus.BAD_REQUEST)
      expect(ejson.data).toMatchObject(entity)
      expect(ejson.errors).toBeArray({ length: VALIDATION_ERRORS.length })
    })

    it('throws 400 if entity with dto.id already exists', async () => {
      const id = uuid()
      const message = `A document with id ${id} already exists.`

      spy.mockReturnValueOnce(Promise.reject(new Error(message)))

      let exception = {} as AppException

      try {
        await TestSubject.create(entity)
      } catch (error) {
        exception = error
      }

      expect(exception.constructor.name).toBe('AppException')

      const ejson = exception.getResponse() as AppExceptionJSON

      expect(ejson.code).toBe(ExceptionStatus.BAD_REQUEST)
      expect(typeof (ejson.errors as PlainObject).id === 'string').toBeTruthy()
      expect(ejson.message.startsWith('Entity')).toBeTruthy()
      expect(ejson.message.endsWith('already exists')).toBeTruthy()
    })
  })

  describe('#delete', () => {
    const TestSubject = new Subject<ICar>(CARS_REPO_PATH)

    it('calls super.delete', async () => {
      const spyGet = jest.spyOn(TestSubject, 'get')
      const spySuper = jest.spyOn(MockBFR.prototype, 'delete')

      spyGet.mockReturnValueOnce(Promise.resolve(mockEntity))

      await TestSubject.delete(entity.id)

      expect(spySuper).toBeCalledTimes(1)
      expect(spySuper).toBeCalledWith(mockEntity.id)
    })
  })

  describe('#get', () => {
    const TestSubject = new Subject<ICar>(CARS_REPO_PATH)

    const spy = jest.spyOn(MockBFR.prototype, 'findById')

    it('returns entity', async () => {
      spy.mockReturnValue(Promise.resolve(mockEntity))

      expect(await TestSubject.get(entity.id)).toMatchObject(mockEntity)
    })

    it('throws if entity does not exist', async () => {
      spy.mockReturnValue(Promise.resolve(null))

      let exception = {} as AppException

      try {
        await TestSubject.get(entity.id)
      } catch (error) {
        exception = error
      }

      expect(exception.constructor.name).toBe('AppException')

      const ejson = exception.getResponse() as AppExceptionJSON

      expect(ejson.code).toBe(ExceptionStatus.NOT_FOUND)
      expect((ejson.errors as PlainObject).id).toBe(entity.id)
      expect(ejson.message).toMatch(new RegExp(`"${entity.id}" does not exist`))
    })
  })

  describe('#patch', () => {
    const TestSubject = new Subject<ICar>(CARS_REPO_PATH)

    const spyGet = jest.spyOn(TestSubject, 'get')
    const spySuper = jest.spyOn(MockBFR.prototype, 'update')

    beforeEach(() => {
      spyGet.mockReturnValue(Promise.resolve(mockEntity))
    })

    it('removes readonly fields from dto', async () => {
      const dto = { ...mockEntity, created_at: Date.now(), id: '' }

      await TestSubject.patch(mockEntity.id, dto)

      expect(spySuper).toBeCalledTimes(1)

      const args = spySuper.mock.calls[0][0]

      expect(args.created_at).not.toBe(dto.created_at)
      expect(args.id).not.toBe(dto.id)
      expect(args.updated_at).not.toBe(dto.updated_at)
    })

    it('throws 400 if dto schema is invalid', async () => {
      let exception = {} as AppException

      spySuper.mockReturnValueOnce(Promise.reject(VALIDATION_ERRORS))

      try {
        await TestSubject.patch(mockEntity.id, mockEntity)
      } catch (error) {
        exception = error
      }

      expect(exception.constructor.name).toBe('AppException')

      const ejson = exception.getResponse() as AppExceptionJSON

      expect(ejson.code).toBe(ExceptionStatus.BAD_REQUEST)
      expect({ ...ejson.data.dto, updated_at: null }).toMatchObject(mockEntity)
      expect(ejson.data.id).toBe(mockEntity.id)
      expect(ejson.errors).toBeArray({ length: VALIDATION_ERRORS.length })
    })
  })
})
