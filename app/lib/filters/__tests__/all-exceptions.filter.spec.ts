import { getMockReq, getMockRes } from '@jest-mock/express'
import type { ArgumentsHost } from '@nestjs/common'
import {
  APP_EXCEPTION,
  APP_EXCEPTION_JSON
} from '@tests/fixtures/app.exception.fixture'
import {
  BAD_REQUEST,
  BAD_REQUEST_JSON
} from '@tests/fixtures/bad-request.exception.fixture'
import FixtureConfig from '@tests/fixtures/config.fixture'
import faker from 'faker'
import URI from 'urijs'
import MockMeasurementProtocol from '../../../config/measurement-protocol'
import AppException from '../../exceptions/app.exception'
import Subject from '../all-exceptions.filter'

/**
 * @file Unit Tests - AllExceptionsFilter
 * @module app/lib/filters/tests/all-exceptions
 */

jest.mock('../../../config/measurement-protocol')

describe('app/lib/filters/AllExceptionsFilter', () => {
  const TestSubject = new Subject(FixtureConfig)

  describe('exports', () => {
    it('class by default', () => {
      expect(Subject).toBeDefined()
      expect(Subject.constructor.name).toBe('Function')
    })
  })

  describe('#catch', () => {
    const uri = new URI('/users?path="users"')

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

    const spyCreateBody = jest.spyOn(AppException, 'createBody')
    const spyTrack = jest.spyOn(TestSubject, 'track')

    it('AppException', async () => {
      await TestSubject.catch(APP_EXCEPTION, mockHost)

      // Expect that error isn't converted into AppException
      expect(spyCreateBody).not.toBeCalled()

      // Expect error `event` hit to be sent
      expect(spyTrack).toBeCalledTimes(1)
    })

    it('HttpException', async () => {
      const { message, statusCode } = BAD_REQUEST_JSON

      await TestSubject.catch(BAD_REQUEST, mockHost)

      // Expect that error converted into AppException
      expect(spyCreateBody).toBeCalledTimes(1)
      expect(spyCreateBody).toBeCalledWith({}, message, statusCode)

      // Expect error `event` hit to be sent
      expect(spyTrack).toBeCalledTimes(1)
    })
  })

  describe('#track', () => {
    it('sends error event hit', async () => {
      await TestSubject.track(APP_EXCEPTION_JSON)

      expect(MockMeasurementProtocol.event).toBeCalledTimes(1)
      expect(MockMeasurementProtocol.event).toBeCalledWith({
        error: JSON.stringify(APP_EXCEPTION_JSON),
        eventAction: APP_EXCEPTION_JSON.name,
        eventCategory: 'Error Response',
        eventLabel: APP_EXCEPTION_JSON.message,
        eventValue: APP_EXCEPTION_JSON.code
      })
    })
  })
})
