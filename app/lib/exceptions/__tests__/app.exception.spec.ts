import { HttpException as MockHttpException } from '@nestjs/common/exceptions/http.exception'
import {
  ExceptionClassName as ClassName,
  ExceptionStatus as Status
} from '../../enums'
import Subject from '../app.exception'

/**
 * @file Unit Tests - AppException
 * @module app/lib/exceptions/tests/app.exception
 */

jest.mock('@nestjs/common/exceptions/http.exception')

describe('app/lib/exceptions/AppException', () => {
  describe('exports', () => {
    it('class by default', () => {
      expect(Subject).toBeDefined()
      expect(Subject.constructor.name).toBe('Function')
    })
  })

  describe('constructor', () => {
    it('calls HttpException class constructor', () => {
      new Subject()

      expect(MockHttpException.prototype.constructor).toBeCalledTimes(1)
    })
  })

  describe('.createBody', () => {
    describe('creates AppExceptionJSON object', () => {
      const epartial = {
        className: ClassName.INTERNAL_SERVER_ERROR,
        code: Status.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        name: 'INTERNAL_SERVER_ERROR'
      }

      it('typeof data === "string"', () => {
        const data = 'Test error message'

        const result = Subject.createBody(data)

        expect(result).toMatchObject({ ...epartial, data: {}, message: data })
      })

      it('typeof data !== "string"', () => {
        const data = { test: true }

        const result = Subject.createBody(data)

        expect(result).toMatchObject({ ...epartial, data })
      })

      it('typeof data?.errors !== undefined', () => {
        const data = { errors: [] }

        const result = Subject.createBody(data)

        expect(result).toMatchObject({
          ...epartial,
          data: {},
          errors: data.errors
        })
      })

      it('typeof data?.message === "string"', () => {
        const data = { message: 'Test error message' }

        const result = Subject.createBody(data)

        expect(result).toMatchObject({
          ...epartial,
          data: {},
          message: data.message
        })
      })
    })
  })
})
