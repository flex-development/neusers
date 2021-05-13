import { getCreateUserDTO, getPatchUserDTO } from '@tests/fixtures/dto.fixture'
import { USERS_MOCK_CACHE as mockCache } from '@tests/fixtures/users.fixture'
import { createTestingModule } from '@tests/utils'
import UsersRepository from '../users.repository'
import UsersService from '../users.service'

/**
 * @file Unit Tests - UsersService
 * @module app/subdomains/users/providers/tests/UsersService
 */

describe('unit:app/subdomains/users/providers/UsersService', () => {
  let TestSubject = new UsersService(new UsersRepository())

  beforeAll(async () => {
    const moduleRef = await createTestingModule({
      providers: [UsersRepository, UsersService]
    })

    TestSubject = moduleRef.get<UsersService>(UsersService)
  })

  beforeEach(() => {
    // @ts-expect-error mocking repository cache
    TestSubject.repo.cache = Object.assign({}, mockCache)
  })

  describe('#create', () => {
    it('should call #repo.create', async () => {
      const spy_repo_create = jest.spyOn(TestSubject.repo, 'create')

      await TestSubject.create(getCreateUserDTO())

      expect(spy_repo_create).toBeCalledTimes(1)
    })
  })

  describe('#delete', () => {
    it('should call #repo.delete', async () => {
      const { id } = TestSubject.repo.cache.collection[0]

      const spy_repo_delete = jest.spyOn(TestSubject.repo, 'delete')

      await TestSubject.delete(id)
      await TestSubject.delete([id])

      expect(spy_repo_delete).toBeCalledTimes(2)
    })
  })

  describe('#find', () => {
    it('should call #repo.query', async () => {
      const { first_name } = TestSubject.repo.cache.collection[0]

      const spy_repo_query = jest.spyOn(TestSubject.repo, 'query')

      await TestSubject.find()
      await TestSubject.find({ first_name })

      expect(spy_repo_query).toBeCalledTimes(2)
    })
  })

  describe('#findOne', () => {
    it('should call #repo.queryOneByEmail', async () => {
      const { email } = TestSubject.repo.cache.collection[0]

      const spy_method = 'queryOneByEmail'
      const spy_repo_queryOneByEmail = jest.spyOn(TestSubject.repo, spy_method)

      await TestSubject.findOne(email)

      expect(spy_repo_queryOneByEmail).toBeCalledTimes(1)
    })

    it('should call #repo.queryOneOrFail', async () => {
      const { id } = TestSubject.repo.cache.collection[0]

      const spy_method = 'queryOneOrFail'
      const spy_repo_queryOneOrFail = jest.spyOn(TestSubject.repo, spy_method)

      await TestSubject.findOne(id)

      expect(spy_repo_queryOneOrFail).toBeCalledTimes(1)
    })
  })

  describe('#patch', () => {
    const spy_repo_find = jest.spyOn(TestSubject.repo, 'find')

    beforeEach(() => {
      spy_repo_find.mockReturnValue(TestSubject.repo.cache.collection)
    })

    it('should call #repo.patch', async () => {
      const { id } = TestSubject.repo.cache.collection[0]

      const spy_repo_patch = jest.spyOn(TestSubject.repo, 'patch')

      await TestSubject.patch(id, getPatchUserDTO('password'))

      expect(spy_repo_patch).toBeCalledTimes(1)
    })
  })
})
