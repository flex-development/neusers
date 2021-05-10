import type { IEntity } from '@flex-development/dreepo'
import FixtureConfig from '@tests/fixtures/config.fixture'
import { REQ_GET } from '@tests/fixtures/req-get.fixture'
import { getMockCallHandler, getMockExecutionContext } from '@tests/utils'
import faker from 'faker'
import MockMeasurementProtocol from '../../../config/measurement-protocol'
import TestSubject from '../pageview.interceptor'

/**
 * @file Unit Tests - PageviewInterceptor
 * @module app/lib/interceptors/tests/PageviewInterceptor
 */

jest.mock('../../../config/measurement-protocol')

describe('unit:app/lib/interceptors/PageviewInterceptor', () => {
  const Subject = new TestSubject(FixtureConfig)

  describe('#intercept', () => {
    it('should send pageview hit', async () => {
      const ENTITY = { created_at: Date.now(), id: faker.datatype.uuid() }

      const mockExecutionContext = getMockExecutionContext(REQ_GET)
      const mockCallHandler = getMockCallHandler<IEntity>(ENTITY)

      await Subject.intercept(mockExecutionContext, mockCallHandler)

      expect(MockMeasurementProtocol.pageview).toBeCalledTimes(1)
      expect(MockMeasurementProtocol.pageview).toBeCalledWith({
        dl: REQ_GET.url,
        documentHost: REQ_GET.headers.host,
        documentPath: REQ_GET.path,
        ds: 'api',
        ip: REQ_GET.headers['x-forwarded-for'],
        ua: REQ_GET.headers['user-agent'],
        'vercel-branch': process.env.VERCEL_GIT_COMMIT_REF,
        'vercel-commit': process.env.VERCEL_GIT_COMMIT_SHA,
        'vercel-env': process.env.VERCEL_ENV
      })
    })
  })
})
