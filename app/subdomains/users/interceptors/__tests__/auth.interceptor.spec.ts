import AppModule from '@/app.module'
import UsersModule from '@/subdomains/users/users.module'
import type { IEntity } from '@flex-development/dreepo'
import { PartialOr } from '@flex-development/dreepo/lib/types-global'
import {
  createTestingModule,
  getMockCallHandler,
  getMockExecutionContext
} from '@tests/utils'
import omit from 'lodash.omit'
import { AuthService } from '../../providers'
import { USERS_MOCK_CACHE } from '../../providers/__tests__/__fixtures__/users.fixture'
import AuthInterceptor from '../auth.interceptor'
import { AUTH_REQ, AUTH_REQ_USER } from './__fixtures__/req-auth.fixture'

/**
 * @file Unit Tests - AuthInterceptor
 * @module app/subdomains/users/interceptors/tests/AuthInterceptor
 */

describe('unit:app/subdomains/users/interceptors/AuthInterceptor', () => {
  let TestSubject: AuthInterceptor

  beforeAll(async () => {
    const moduleRef = await createTestingModule({
      imports: [AppModule, UsersModule],
      providers: [AuthService]
    })

    TestSubject = moduleRef.get<AuthInterceptor>(AuthInterceptor)
  })

  beforeEach(() => {
    // @ts-expect-error mocking repository cache
    TestSubject.auth.users.repo.cache = Object.assign({}, USERS_MOCK_CACHE)
  })

  describe('#intercept', () => {
    it('should authenticate user', async () => {
      const spy_auth_decode = jest.spyOn(TestSubject.auth, 'decodeBasicAuth')
      const spy_auth_login = jest.spyOn(TestSubject.auth, 'login')

      const req = Object.assign({}, AUTH_REQ)

      const mockExecutionContext = getMockExecutionContext(req)
      const mockCallHandler = getMockCallHandler<IEntity>(AUTH_REQ_USER)

      await TestSubject.intercept(mockExecutionContext, mockCallHandler)

      expect(spy_auth_decode).toBeCalledTimes(1)
      expect(spy_auth_login).toBeCalledTimes(1)

      expect(req.params.authorized).toBe('true')

      expect(mockCallHandler.handle).toBeCalledTimes(1)
    })

    it('should allow unauthenticated GET requests', async () => {
      const spy_auth_decode = jest.spyOn(TestSubject.auth, 'decodeBasicAuth')
      const spy_auth_login = jest.spyOn(TestSubject.auth, 'login')

      const req = Object.assign({}, omit(AUTH_REQ, ['headers']))
      const payload = Object.assign({}, omit(AUTH_REQ_USER, ['password']))

      const mockExecutionContext = getMockExecutionContext(req)
      const mockCallHandler = getMockCallHandler<PartialOr<IEntity>>(payload)

      await TestSubject.intercept(mockExecutionContext, mockCallHandler)

      expect(spy_auth_decode).toBeCalledTimes(1)
      expect(spy_auth_login).toBeCalledTimes(1)

      expect(req.params.authorized).toBe('false')

      expect(mockCallHandler.handle).toBeCalledTimes(1)
    })
  })
})
