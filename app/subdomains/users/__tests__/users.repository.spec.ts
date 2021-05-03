import repoPath from '@/lib/utils/repoPath.util'
import Repository from '@flex-development/dreepo/repositories/repository'
import { hash } from 'bcryptjs'
import TestSubject from '../users.repository'

/**
 * @file Unit Tests - UsersRepository
 * @module app/subdomains/users/tests/UsersRepository
 */

jest.mock('@/lib/utils/repoPath.util')
jest.mock('@flex-development/dreepo/repositories/repository')

const MockRepository = Repository as jest.MockedClass<typeof Repository>
const mockHash = hash as jest.MockedFunction<typeof hash>
const mockRepoPath = repoPath as jest.MockedFunction<typeof repoPath>

describe('unit:app/subdomains/users/UsersRepository', () => {
  /**
   * Returns a test `UsersRepository` instance.
   *
   * @return {TestSubject} Test `UsersRepository` instance
   */
  const getSubject = (): TestSubject => new TestSubject()

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
    it.todo('should hash password')

    it.todo('should throw AppException if error hashing password')
  })

  describe('#findByOneEmail', () => {
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
