import { getMockReq, getMockRes } from '@jest-mock/express'
import type { ArgumentsHost } from '@nestjs/common'
import FixtureConfig from '@tests/fixtures/config.fixture'
import { EXCEPTION_JSON } from '@tests/fixtures/exception.fixture'
import faker from 'faker'
import URI from 'urijs'
import MockMeasurementProtocol from '../../../config/measurement-protocol'
import TestSubject from '../all-exceptions.filter'

/**
 * @file Unit Tests - AllExceptionsFilter
 * @module app/lib/filters/tests/AllExceptionsFilter
 */

jest.mock('../../../config/measurement-protocol')

describe('unit:app/lib/filters/AllExceptionsFilter', () => {
  const Subject = new TestSubject(FixtureConfig)

  describe('exports', () => {
    it('should export class by default', () => {
      expect(TestSubject).toBeDefined()
      expect(TestSubject.constructor.name).toBe('Function')
    })
  })

  describe('#catch', () => {
    const uri = new URI('/users?path=users')

    const req = getMockReq({
      headers: { 'user-agent': faker.internet.userAgent() },
      method: 'get',
      path: uri.path(),
      url: uri.valueOf()
    })

    const res = {
      ...getMockRes({}),
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis()
    }

    const mockHost = {
      switchToHttp: () => ({ getRequest: () => req, getResponse: () => res })
    } as ArgumentsHost

    it.todo('should handle Exception')

    it.todo('should handle HttpException')
  })

  describe('#track', () => {
    it('should send error event hit', async () => {
      await Subject.track(EXCEPTION_JSON)

      expect(MockMeasurementProtocol.event).toBeCalledTimes(1)
      expect(MockMeasurementProtocol.event).toBeCalledWith({
        error: JSON.stringify(EXCEPTION_JSON),
        eventAction: EXCEPTION_JSON.name,
        eventCategory: 'Error Response',
        eventLabel: EXCEPTION_JSON.message,
        eventValue: EXCEPTION_JSON.code
      })
    })
  })
})
