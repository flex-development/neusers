import { ExceptionStatusCode } from '@flex-development/exceptions/enums'
import { DEM } from '@flex-development/exceptions/exceptions'
import Exception from '@flex-development/exceptions/exceptions/base.exception'
import { HttpException } from '@nestjs/common/exceptions/http.exception'
import TestSubject from '../app.exception'

/**
 * @file Unit Tests - AppException
 * @module app/lib/exceptions/tests/app.exception
 */

jest.mock('@flex-development/exceptions/exceptions/base.exception')
jest.mock('@nestjs/common/exceptions/http.exception')

const MockHttpException = HttpException as jest.MockedClass<
  typeof HttpException
>
const MockException = Exception as jest.MockedClass<typeof Exception>

describe('app/lib/exceptions/AppException', () => {
  const datastr = 'Test error message'
  const data = { test: true }

  const { constructor: MockExceptionConstructor } = MockException.prototype
  const spy_toJSON = jest.spyOn(MockException.prototype, 'toJSON')

  const ecode = ExceptionStatusCode.INTERNAL_SERVER_ERROR
  const emessage = DEM

  describe('exports', () => {
    it('should export class by default', () => {
      expect(TestSubject).toBeDefined()
      expect(TestSubject.constructor.name).toBe('Function')
    })
  })

  describe('constructor', () => {
    it('should call HttpException class constructor', () => {
      new TestSubject()

      expect(MockHttpException.prototype.constructor).toBeCalledTimes(1)
    })

    it('should call Exception constructor with error message object', () => {
      const edata = { message: datastr }

      new TestSubject(ExceptionStatusCode.INTERNAL_SERVER_ERROR, DEM, datastr)

      expect(MockExceptionConstructor).toBeCalledTimes(1)
      expect(MockExceptionConstructor).toBeCalledWith(
        ecode,
        emessage,
        edata,
        undefined
      )
    })

    it('should call Exception constructor', () => {
      new TestSubject()

      expect(MockException.prototype.constructor).toBeCalledTimes(1)
    })

    it('should override #response property', () => {
      new TestSubject()

      expect(spy_toJSON).toBeCalledTimes(1)
    })
  })

  describe('.createBody', () => {
    it('should call Exception constructor with error message object', () => {
      const edata = { message: datastr }

      TestSubject.createBody(datastr)

      expect(MockExceptionConstructor).toBeCalledTimes(1)
      expect(MockExceptionConstructor).toBeCalledWith(ecode, emessage, edata)

      expect(spy_toJSON).toBeCalledTimes(1)
    })

    it('should call Exception constructor', () => {
      TestSubject.createBody(data)

      expect(MockExceptionConstructor).toBeCalledTimes(1)
      expect(MockExceptionConstructor).toBeCalledWith(ecode, emessage, data)

      expect(spy_toJSON).toBeCalledTimes(1)
    })
  })
})
