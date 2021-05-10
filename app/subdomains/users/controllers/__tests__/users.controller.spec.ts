/**
 * @file E2E Tests - UsersController
 * @module app/subdomains/users/controllers/tests/UsersController
 */

jest.unmock('axios')
jest.unmock('bcryptjs')
jest.unmock('uuid')

describe('e2e:subdomains/users/controllers/UsersController', () => {
  describe('/users', () => {
    describe('GET', () => {
      describe('200 OK', () => {
        it.todo('should query database')
      })
    })

    describe('POST', () => {
      describe('201 CREATED', () => {
        it.todo('should create new user')
      })

      describe('400 BAD REQUEST', () => {
        it.todo('should require dto to be CreateUserDTO object')
      })

      describe('409 CONFLICT', () => {
        it.todo('should not allow users with same email address')
      })
    })
  })

  describe('/users/{user}', () => {
    describe('DELETE', () => {
      describe('204 NO CONTENT', () => {
        it.todo('should delete user')
      })

      describe('401 UNAUTHORIZED', () => {
        it.todo('should require user to login')
      })

      describe('404 NOT FOUND', () => {
        it.todo('should require user to exist before deleting')
      })
    })

    describe('GET', () => {
      describe('200 OK', () => {
        it.todo('should return user without sensitive data if not logged in')

        it.todo('should return user with sensitive data if logged in')
      })

      describe('404 NOT FOUND', () => {
        it.todo('should not find user')
      })
    })

    describe('PUT', () => {
      describe('200 OK', () => {
        it.todo('should patch user')
      })

      describe('400 BAD REQUEST', () => {
        it.todo('should require dto to be PatchUserDTO object')
      })

      describe('401 UNAUTHORIZED', () => {
        it.todo('should require user to login')
      })

      describe('404 NOT FOUND', () => {
        it.todo('should require user to exist before patching')
      })
    })
  })
})
