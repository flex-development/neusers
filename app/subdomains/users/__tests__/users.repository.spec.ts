import MockAlgoliaRepo from '../../../lib/repositories/algolia.repository'
import { USERS_ROOT } from './__fixtures__/users.fixture'

/**
 * @file Unit Tests - UsersRepository
 * @module app/subdomains/users/tests/UsersRepository
 */

jest.mock('../../../config/algolia')
jest.mock('../../../lib/repositories/algolia.repository')

describe('app/subdomains/users/UsersRepository', () => {
  const OBJECTS = Object.values(USERS_ROOT).map(object => ({
    ...object,
    created_at: Date.now(),
    updated_at: null
  }))

  describe('#create', () => {
    it.todo('hashes password')
  })

  describe('#findByOneEmail', () => {
    const spy = jest.spyOn(MockAlgoliaRepo.prototype, 'findAll')

    it.todo('returns user entity')

    describe('throws', () => {
      it.todo('if user is found and should not exist')

      it.todo('if user is not found and should exist')
    })
  })

  describe('#patch', () => {
    it.todo('hashes updated password')
  })

  describe('#searchOptions', () => {
    it.todo('formats params.email')

    it.todo('formats params.first_name')

    it.todo('formats params.last_name')
  })
})
