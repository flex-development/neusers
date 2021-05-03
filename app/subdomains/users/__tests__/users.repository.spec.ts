import { AppException } from '@/lib/exceptions'
import repoPath from '@/lib/utils/repoPath.util'
import Repository from '@flex-development/dreepo/repositories/repository'
import { ExceptionStatusCode } from '@flex-development/exceptions/enums'
import type { ExceptionJSON } from '@flex-development/exceptions/interfaces'
import { hashSync } from 'bcryptjs'
import faker from 'faker'
import omit from 'lodash.omit'
import type { CreateUserDTO } from '../dto/create-user.dto'
import TestSubject from '../users.repository'
import { USERS_MOCK_CACHE as mockCache } from './__fixtures__/users.fixture'

/**
 * @file Unit Tests - UsersRepository
 * @module app/subdomains/users/tests/UsersRepository
 */

jest.mock('@/lib/utils/repoPath.util')
jest.mock('@flex-development/dreepo/repositories/repository')

const MockRepository = Repository as jest.MockedClass<typeof Repository>
const mockHashSync = hashSync as jest.MockedFunction<typeof hashSync>
const mockRepoPath = repoPath as jest.MockedFunction<typeof repoPath>

describe('unit:app/subdomains/users/UsersRepository', () => {
  /**
   * Returns a test `UsersRepository` instance.
   *
   * @return {TestSubject} Test `UsersRepository` instance
   */
  const getSubject = (): TestSubject => {
    const Subject = new TestSubject()

    // @ts-expect-error mocking cache
    Subject.cache = Object.assign({}, mockCache)

    return Subject
  }

  describe('exports', () => {
    it('should export class by default', () => {
      expect(TestSubject).toBeDefined()
      expect(TestSubject.constructor.name).toBe('Function')
    })
  })

  describe('constructor', () => {
    const { constructor } = MockRepository.prototype

    beforeEach(() => {
      getSubject()
    })

    it('should call dreepo Repository class constructor', () => {
      expect(constructor).toBeCalledTimes(1)
    })

    it('should call repoPath utility function', () => {
      expect(mockRepoPath).toBeCalledTimes(1)
    })
  })

  describe('#create', () => {
    const Subject = getSubject()

    const spy_find = jest.spyOn(Subject, 'find')

    const CREATE_USER_DTO: CreateUserDTO = Object.freeze({
      email: faker.internet.exampleEmail(),
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      password: faker.internet.password()
    })

    const getCreateUserDTO = () => Object.assign({}, CREATE_USER_DTO)

    beforeEach(() => {
      spy_find.mockReturnValue(Subject.cache.collection)
    })

    it('should check if user exists with dto.email', async () => {
      const spy_findOneByEmail = jest.spyOn(Subject, 'findOneByEmail')

      spy_findOneByEmail.mockReturnValueOnce(null)

      await Subject.create(getCreateUserDTO())

      expect(spy_findOneByEmail).toBeCalledTimes(1)
      expect(spy_findOneByEmail.mock.calls[0][0]).toBe(CREATE_USER_DTO.email)
    })

    it('should hash password', async () => {
      await Subject.create(getCreateUserDTO())

      expect(mockHashSync).toBeCalledTimes(1)
      expect(mockHashSync.mock.calls[0][0]).toBe(CREATE_USER_DTO.password)
    })

    it('should throw AppException if error hashing password', async () => {
      mockHashSync.mockImplementationOnce(() => {
        throw new Error('Test hashSync error')
      })

      let exception = {} as AppException

      try {
        await Subject.create(getCreateUserDTO())
      } catch (error) {
        exception = error
      }

      const ejson = exception.getResponse() as ExceptionJSON

      expect(ejson.code).toBe(ExceptionStatusCode.INTERNAL_SERVER_ERROR)
      expect(ejson.data).toMatchObject(omit(CREATE_USER_DTO, 'password'))
    })
  })

  describe('#findOneByEmail', () => {
    it.todo('should return user entity')

    describe('throws', () => {
      it.todo('should throw if user is found and should not exist')

      it.todo('should throw if user is not found and should exist')
    })
  })

  describe('#patch', () => {
    it.todo('should hash updated password')
  })
})
