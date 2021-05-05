import { USERS_MOCK_CACHE } from '@/subdomains/users/providers/__tests__/__fixtures__/users.fixture'
import UsersModule from '@/subdomains/users/users.module'
import { ExceptionStatusCode } from '@flex-development/exceptions/enums'
import Exception from '@flex-development/exceptions/exceptions/base.exception'
import { createTestingModule } from '@tests/utils'
import faker from 'faker'
import type { PlainObject } from 'simplytyped'
import AuthService from '../auth.service'

/**
 * @file Unit Tests - AuthService
 * @module app/subdomains/auth/providers/tests/AuthService
 */

describe('unit:app/subdomains/auth/providers/AuthService', () => {
  let TestSubject: AuthService

  beforeAll(async () => {
    const moduleRef = await createTestingModule({
      imports: [UsersModule],
      providers: [AuthService]
    })

    TestSubject = moduleRef.get<AuthService>(AuthService)
  })

  beforeEach(() => {
    // @ts-expect-error mocking repository cache
    TestSubject.users.repo.cache = Object.assign({}, USERS_MOCK_CACHE)
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
