import AppModule from '@/app.module'
import { CreateUserDTO, PatchUserDTO } from '@/subdomains/users/dto'
import { UsersRepository, UsersService } from '@/subdomains/users/providers'
import {
  getCreateUserDTO,
  getPatchUserDTO
} from '@/subdomains/users/providers/__tests__/__fixtures__/dto.fixture'
import { USERS_MOCK_CACHE } from '@/subdomains/users/providers/__tests__/__fixtures__/users.fixture'
import UsersModule from '@/subdomains/users/users.module'
import type { UserQuery } from '@/subdomains/users/users.types'
import { ExceptionStatusCode } from '@flex-development/exceptions/enums'
import type { INestApplication } from '@nestjs/common'
import { HttpStatus } from '@nestjs/common'
import {
  clearUsersRepository,
  createTestNestApp,
  loadUsersRepository,
  testURLPath,
  USERS_REPO_TEST_PATH
} from '@tests/utils'
import faker from 'faker'
import omit from 'lodash.omit'
import type { SuperTest, Test } from 'supertest'
import request from 'supertest'

/**
 * @file E2E Tests - UsersController
 * @module app/subdomains/users/controllers/tests/UsersController
 */

jest.unmock('axios')
jest.unmock('bcryptjs')
jest.unmock('uuid')

describe('e2e:subdomains/users/controllers/UsersController', () => {
  const { collection: USERS, root: USERS_ROOT } = USERS_MOCK_CACHE

  let Service = new UsersService(new UsersRepository())

  let app: INestApplication
  let req: SuperTest<Test>

  beforeAll(async () => {
    const metadata = { imports: [AppModule, UsersModule] }
    const testing = await createTestNestApp(metadata, UsersService, Service)

    Service = testing.moduleRef.get<UsersService>(UsersService)
    app = testing.app

    // @ts-expect-error testing
    Service.repo.dbconn.path = USERS_REPO_TEST_PATH

    await Service.repo.refreshCache()
    await app.init()

    req = request(app.getHttpServer())
  })

  afterAll(async () => {
    await app.close()
  })

  describe('/users', () => {
    const URL = testURLPath('users')

    beforeAll(async () => {
      await clearUsersRepository()
      await loadUsersRepository(USERS_ROOT)
    })

    describe('GET', () => {
      describe('200 OK', () => {
        it('should query database', async () => {
          const query: UserQuery = { email: USERS[0].email }

          const ebody = await Service.find(query)

          const response = await req.get(testURLPath(URL, query))

          expect(response).toBeJSONResponse({ status: HttpStatus.OK })
          expect(response.body).toEqual(expect.arrayContaining(ebody))
        })
      })
    })

    describe('POST', () => {
      beforeAll(async () => {
        await clearUsersRepository()
        await loadUsersRepository(USERS_ROOT)
      })

      afterAll(async () => {
        await clearUsersRepository()
      })

      describe('201 CREATED', () => {
        const estatus = HttpStatus.CREATED

        it('should create new user', async () => {
          const body: CreateUserDTO = getCreateUserDTO()

          const ebody = omit(body, ['password'])

          const response = await req.post(URL).send(body)

          expect(response).toBeJSONResponse({ status: estatus })
          expect(omit(response.body, ['password'])).toMatchObject(ebody)
        })
      })

      describe('400 BAD REQUEST', () => {
        const estatus = ExceptionStatusCode.BAD_REQUEST

        it('should require dto to be CreateUserDTO object', async () => {
          const body: Partial<CreateUserDTO> = {}

          const response = await req.post(URL).send(body)

          expect(response).toBeJSONResponse({ status: estatus })
          expect(response.body.data.target).toMatchObject(body)
        })
      })

      describe('409 CONFLICT', () => {
        const estatus = ExceptionStatusCode.CONFLICT

        it('should not allow users with same email address', async () => {
          const body: CreateUserDTO = {
            ...getCreateUserDTO(),
            email: USERS[0].email
          }

          const response = await req.post(URL).send(body)

          expect(response).toBeJSONResponse({ status: estatus })
        })
      })
    })
  })

  describe('/users/{user}', () => {
    describe('DELETE', () => {
      beforeAll(async () => {
        await loadUsersRepository(USERS_ROOT)
      })

      afterAll(async () => {
        await clearUsersRepository()
      })

      describe('204 NO CONTENT', () => {
        const USER = USERS[USERS.length - 1]
        const estatus = HttpStatus.NO_CONTENT

        it('should delete user', async () => {
          const url = testURLPath(`users/${USER.id}`)

          const response = await req.delete(url).auth(USER.email, USER.password)

          expect(response).toBeJSONResponse({ status: estatus })
        })
      })

      describe('401 UNAUTHORIZED', () => {
        const USER = USERS[1]
        const estatus = ExceptionStatusCode.UNAUTHORIZED

        it('should require successful user login', async () => {
          const url = testURLPath(`users/${USER.id}`)

          const response = await req.delete(url)

          expect(response).toBeJSONResponse({ status: estatus })
        })
      })
    })

    describe('GET', () => {
      beforeAll(async () => {
        await loadUsersRepository(USERS_ROOT)
      })

      afterAll(async () => {
        await clearUsersRepository()
      })

      describe('200 OK', () => {
        const USER = USERS[1]
        const URL = testURLPath(`users/${USER.id}`)

        it('should return user without password if not logged in', async () => {
          const response = await req.get(URL)

          expect(response).toBeJSONResponse({ status: HttpStatus.OK })
          expect(response.body).toMatchObject(omit(USER, ['password']))
        })

        it('should return user with password if logged in', async () => {
          const response = await req.get(URL).auth(USER.email, USER.password)

          expect(response).toBeJSONResponse({ status: HttpStatus.OK })
          expect(response.body).toMatchObject(USER)
        })
      })

      describe('404 NOT FOUND', () => {
        const estatus = ExceptionStatusCode.NOT_FOUND

        it('should not find user', async () => {
          const url = testURLPath('users/user')

          const response = await req.get(url)

          expect(response).toBeJSONResponse({ status: estatus })
        })
      })
    })

    describe('PUT', () => {
      const USER = USERS[1]
      const URL = testURLPath(`users/${USER.id}`)

      const { email, password } = USER

      beforeAll(async () => {
        await loadUsersRepository(USERS_ROOT)
      })

      afterAll(async () => {
        await clearUsersRepository()
      })

      describe('200 OK', () => {
        it('should patch user', async () => {
          const body: PatchUserDTO = { first_name: faker.name.firstName() }

          const response = await req.put(URL).send(body).auth(email, password)

          expect(response).toBeJSONResponse({ status: HttpStatus.OK })
        })
      })

      describe('400 BAD REQUEST', () => {
        const estatus = ExceptionStatusCode.BAD_REQUEST

        it('should require dto to be PatchUserDTO object', async () => {
          const body = { test: true }

          const response = await req.put(URL).send(body).auth(email, password)

          expect(response).toBeJSONResponse({ status: estatus })
        })
      })

      describe('401 UNAUTHORIZED', () => {
        const estatus = ExceptionStatusCode.UNAUTHORIZED

        it('should require successful user login', async () => {
          const body: PatchUserDTO = getPatchUserDTO('email')

          const response = await req.put(URL).send(body)

          expect(response).toBeJSONResponse({ status: estatus })
        })
      })

      describe('409 CONFLICT', () => {
        const estatus = ExceptionStatusCode.CONFLICT

        it('should not allow users with same email address', async () => {
          const body: PatchUserDTO = { email: USERS[2].email }

          const response = await req.put(URL).send(body).auth(email, password)

          expect(response).toBeJSONResponse({ status: estatus })
        })
      })
    })
  })
})
