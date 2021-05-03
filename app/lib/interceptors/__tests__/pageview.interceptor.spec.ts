import type { IEntity } from '@flex-development/dreepo/lib/models/entity.model'
import { getMockReq } from '@jest-mock/express'
import type { CallHandler, ExecutionContext } from '@nestjs/common'
import FixtureConfig from '@tests/fixtures/config.fixture'
import faker from 'faker'
import URI from 'urijs'
import MockMeasurementProtocol from '../../../config/measurement-protocol'
import TestSubject from '../pageview.interceptor'

/**
 * @file Unit Tests - PageviewInterceptor
 * @module app/lib/interceptors/tests/PageviewInterceptor
 */

jest.mock('../../../config/measurement-protocol')

describe('unit:app/lib/interceptors/PageviewInterceptor', () => {
  const Subject = new TestSubject<IEntity>(FixtureConfig)

  describe('exports', () => {
    it('should class by default', () => {
      expect(TestSubject).toBeDefined()
      expect(TestSubject.constructor.name).toBe('Function')
    })
  })

  describe('#intercept', () => {
    const uri = new URI('/users?path=users')

    const req = getMockReq({
      headers: {
        host: faker.internet.domainName(),
        'user-agent': faker.internet.userAgent(),
        'x-forwarded-for': faker.internet.ip()
      },
      method: 'get',
      path: uri.path(),
      url: uri.valueOf()
    })

    it('should send pageview hit', async () => {
      const context = { switchToHttp: () => ({ getRequest: () => req }) }

      const next: CallHandler<IEntity[]> = {
        handle: jest.fn().mockReturnValue(Promise.resolve([]))
      }

      await Subject.intercept(context as ExecutionContext, next)

      expect(MockMeasurementProtocol.pageview).toBeCalledTimes(1)
      expect(MockMeasurementProtocol.pageview).toBeCalledWith({
        dl: req.url,
        documentHost: req.headers.host,
        documentPath: req.path,
        ds: 'api',
        ip: req.headers['x-forwarded-for'],
        ua: req.headers['user-agent'],
        'vercel-branch': process.env.VERCEL_GIT_COMMIT_REF,
        'vercel-commit': process.env.VERCEL_GIT_COMMIT_SHA,
        'vercel-env': process.env.VERCEL_ENV
      })
    })
  })
})
