import AppModule from '@/app.module'
import { USERS_MOCK_CACHE } from '@/subdomains/users/providers/__tests__/__fixtures__/users.fixture'
import UsersModule from '@/subdomains/users/users.module'
import { ExceptionStatusCode } from '@flex-development/exceptions/enums'
import Exception from '@flex-development/exceptions/exceptions/base.exception'
import { createTestingModule } from '@tests/utils'
import faker from 'faker'
import type { PlainObject } from 'simplytyped'
import AuthService from '../auth.service'
import AUTHORIZATION_HEADER from './__fixtures__/authorization.fixture'

/**
 * @file Unit Tests - AuthService
 * @module app/subdomains/users/providers/tests/AuthService
 */

describe('unit:app/subdomains/users/providers/AuthService', () => {
  let TestSubject: AuthService

  beforeAll(async () => {
    const moduleRef = await createTestingModule({
      imports: [AppModule, UsersModule],
      providers: [AuthService]
    })

    TestSubject = moduleRef.get<AuthService>(AuthService)
  })

  beforeEach(() => {
    // @ts-expect-error mocking repository cache
    TestSubject.users.repo.cache = Object.assign({}, USERS_MOCK_CACHE)
  })

  describe('#decodeBasicAuth', () => {
    it('should return BasicAuthDecoded object if authorization header', () => {
      const auth = TestSubject.decodeBasicAuth(AUTHORIZATION_HEADER)

      expect(typeof auth.email === 'string').toBeTruthy()
      expect(typeof auth.password === 'string').toBeTruthy()
    })

    it('should return BasicAuthDecoded object if random string', () => {
      const auth = TestSubject.decodeBasicAuth('RANDOM_STRING')

      expect(typeof auth.email === 'string').toBeTruthy()
      expect(typeof auth.password === 'string').toBeTruthy()
    })

    it('should throw Exception if error occurs', () => {
      const authorization = ([] as unknown) as string

      let exception = {} as Exception

      try {
        TestSubject.decodeBasicAuth(authorization)
      } catch (error) {
        exception = error
      }

      expect(exception.code).toBe(ExceptionStatusCode.INTERNAL_SERVER_ERROR)
      expect(exception.data).toMatchObject({ authorization })
    })
  })

  describe('#login', () => {
    const USER = USERS_MOCK_CACHE.collection[0]

    it('should return user data without password', async () => {
      const user = await TestSubject.login(USER.email, USER.password)

      expect(user.password).not.toBeDefined()
      expect(USER).toMatchObject(user)
    })

    it('should throw 401 UNAUTHORIZED if login fails', async () => {
      const password = faker.internet.password()

      let exception = {} as Exception

      try {
        await TestSubject.login(USER.email, password)
      } catch (error) {
        exception = error
      }

      expect(exception.code).toBe(ExceptionStatusCode.UNAUTHORIZED)
      expect(exception.data.email).toBe(USER.email)
      expect((exception.errors as PlainObject).password).toBe(password)
    })
  })
})
