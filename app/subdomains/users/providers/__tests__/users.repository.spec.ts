import { RepoSearchParamsBuilder } from '@flex-development/dreepo'
import Repository from '@flex-development/dreepo/repositories/repository'
import { ExceptionStatusCode } from '@flex-development/exceptions/enums'
import Exception from '@flex-development/exceptions/exceptions/base.exception'
import {
  CREATE_USER_DTO,
  getCreateUserDTO,
  getPatchUserDTO,
  PATCH_USER_DTO_EMAIL,
  PATCH_USER_DTO_PASSWORD
} from '@tests/fixtures/dto.fixture'
import { USERS_MOCK_CACHE as mockCache } from '@tests/fixtures/users.fixture'
import { hashSync } from 'bcryptjs'
import faker from 'faker'
import omit from 'lodash.omit'
import type { PlainObject } from 'simplytyped'
import type { IUser } from '../../interfaces'
import TestSubject from '../users.repository'

/**
 * @file Unit Tests - UsersRepository
 * @module app/subdomains/users/providers/tests/UsersRepository
 */

jest.mock('@flex-development/dreepo/repositories/repository')

const MockRepository = Repository as jest.MockedClass<typeof Repository>
const mockHashSync = hashSync as jest.MockedFunction<typeof hashSync>

describe('unit:app/subdomains/users/providers/UsersRepository', () => {
  const Subject = new TestSubject()

  // @ts-expect-error mocking cache
  Subject.cache = Object.assign({}, mockCache)

  // @ts-expect-error mocking qbuilder
  Subject.qbuilder = new RepoSearchParamsBuilder<IUser>()

  describe('constructor', () => {
    const { constructor } = MockRepository.prototype

    beforeEach(() => {
      new TestSubject()
    })

    it('should call dreepo Repository class constructor', () => {
      expect(constructor).toBeCalledTimes(1)
    })
  })

  describe('#create', () => {
    const spy_find = jest.spyOn(Subject, 'find')

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

    it('should hash password if non-empty string', async () => {
      await Subject.create(getCreateUserDTO())

      expect(mockHashSync).toBeCalledTimes(1)
      expect(mockHashSync.mock.calls[0][0]).toBe(CREATE_USER_DTO.password)
    })

    it('should throw Exception if error hashing password', async () => {
      mockHashSync.mockImplementationOnce(() => {
        throw new Error('Test hashSync create error')
      })

      let exception = {} as Exception

      try {
        await Subject.create(getCreateUserDTO())
      } catch (error) {
        exception = error
      }

      const ejson = exception.toJSON()

      expect(ejson.code).toBe(ExceptionStatusCode.INTERNAL_SERVER_ERROR)
      expect(ejson.data).toMatchObject(omit(CREATE_USER_DTO, 'password'))
    })
  })

  describe('#findOneByEmail', () => {
    const ENTITY = Subject.cache.collection[0]

    const FAKE_EMAIL = faker.internet.exampleEmail()
    const SHOULD_NOT_EXIST = false

    const spy_find = jest.spyOn(Subject, 'find')

    it('should return null if user is not found and should not exist', () => {
      spy_find.mockReturnValueOnce([])

      const entity = Subject.findOneByEmail(FAKE_EMAIL, {}, SHOULD_NOT_EXIST)

      expect(entity).toBe(null)
    })

    it('should return user if found and should exist', () => {
      spy_find.mockReturnValueOnce(Subject.cache.collection)

      const entity = Subject.findOneByEmail(ENTITY.email)

      expect(entity).toMatchObject(ENTITY)
    })

    describe('should throw', () => {
      it('should throw if user is found and should not exist', () => {
        spy_find.mockReturnValueOnce(Subject.cache.collection)

        const emessage = `User with email "${ENTITY.email}" already exists`

        let exception = {} as Exception

        try {
          Subject.findOneByEmail(ENTITY.email, undefined, SHOULD_NOT_EXIST)
        } catch (error) {
          exception = error
        }

        const ejson = exception.toJSON()

        expect(ejson.code).toBe(ExceptionStatusCode.CONFLICT)
        expect(ejson.data).toMatchObject({
          exists: SHOULD_NOT_EXIST,
          params: {}
        })
        expect((ejson.errors as PlainObject).email).toBe(ENTITY.email)
        expect(ejson.message).toBe(emessage)
      })

      it('should throw if user is not found and should exist', () => {
        spy_find.mockReturnValueOnce([])

        const email = faker.internet.exampleEmail()
        const emessage = `User with email "${email}" does not exist`

        let exception = {} as Exception

        try {
          Subject.findOneByEmail(email)
        } catch (error) {
          exception = error
        }

        const ejson = exception.toJSON()

        expect(ejson.code).toBe(ExceptionStatusCode.NOT_FOUND)
        expect(ejson.data).toMatchObject({ exists: true, params: {} })
        expect((ejson.errors as PlainObject).email).toBe(email)
        expect(ejson.message).toBe(emessage)
      })
    })
  })

  describe('#patch', () => {
    const ENTITY = Subject.cache.collection[1]

    const spy_find = jest.spyOn(Subject, 'find')

    beforeEach(() => {
      spy_find.mockReturnValue(Subject.cache.collection)
    })

    it('should check if user with dto.email exists', async () => {
      const { email } = PATCH_USER_DTO_EMAIL

      const spy_findOneByEmail = jest.spyOn(Subject, 'findOneByEmail')

      spy_findOneByEmail.mockReturnValueOnce(ENTITY)

      await Subject.patch(ENTITY.id, getPatchUserDTO('email'))

      expect(spy_findOneByEmail).toBeCalledTimes(1)
      expect(spy_findOneByEmail.mock.calls[0][0]).toBe(email)
    })

    it('should hash updated password if non-empty string', async () => {
      const { password } = PATCH_USER_DTO_PASSWORD

      await Subject.patch(ENTITY.id, getPatchUserDTO('password'))

      expect(mockHashSync).toBeCalledTimes(1)
      expect(mockHashSync.mock.calls[0][0]).toBe(password)
    })

    it('should throw Exception if error hashing password', async () => {
      mockHashSync.mockImplementationOnce(() => {
        throw new Error('Test hashSync patch error')
      })

      const dto = { password: 'password' }

      let exception = {} as Exception

      try {
        await Subject.patch(ENTITY.id, dto)
      } catch (error) {
        exception = error
      }

      const ejson = exception.toJSON()

      expect(ejson.code).toBe(ExceptionStatusCode.INTERNAL_SERVER_ERROR)
      expect(ejson.data).toMatchObject(omit(dto, 'password'))
    })
  })

  describe('#queryOneByEmail', () => {
    const EMAIL = Subject.cache.collection[0].email

    const spy_find = jest.spyOn(Subject, 'find')

    const spy_qbuilder_params = jest.spyOn(Subject.qbuilder, 'params')
    const spy_findOneByEmail = jest.spyOn(Subject, 'findOneByEmail')

    beforeEach(() => {
      spy_find.mockReturnValueOnce(Subject.cache.collection)
      Subject.queryOneByEmail(EMAIL)
    })

    it('should call #qbuilder.params', () => {
      expect(spy_qbuilder_params).toBeCalledTimes(1)
      expect(spy_qbuilder_params).toBeCalledWith(undefined)
    })

    it('should call #findOneByEmail', () => {
      expect(spy_findOneByEmail).toBeCalledTimes(1)
    })
  })
})
