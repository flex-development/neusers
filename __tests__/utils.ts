import DBCONNS from '@/config/database'
import type { InterceptorResponse } from '@/lib/types'
import type { IUser } from '@/subdomains/users/interfaces'
import type {
  EmptyObject,
  NumberString,
  RepoRoot
} from '@flex-development/dreepo'
import { getMockReq } from '@jest-mock/express'
import type { MockRequest } from '@jest-mock/express/dist/src/request'
import type {
  CallHandler,
  ExecutionContext,
  INestApplication,
  ModuleMetadata
} from '@nestjs/common'
import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import type { VercelRequestQuery as Query } from '@vercel/node'
import merge from 'lodash/merge'
import qs from 'querystring'
import type { PlainObject } from 'simplytyped'

/**
 * @file Testing Utilities
 * @module tests/utils
 */

type INestApplicationTest = {
  app: INestApplication
  moduleRef: TestingModule
}

export const USERS_REPO_TEST_PATH = 'test/users'

/**
 * Returns a NestJS test app and module reference.
 *
 * - https://docs.nestjs.com/fundamentals/testing#end-to-end-testing
 *
 * @async
 * @param {ModuleMetadata} metadata - Module metadata
 * @param {any} overrideProvider - Test provider
 * @param {any} value - Test provider value
 * @return {Promise<INestApplicationTest>} Promise containing NestJS test app
 * and module reference
 */
export const createTestNestApp = async (
  metadata: ModuleMetadata,
  overrideProvider: any,
  value: any
): Promise<INestApplicationTest> => {
  const moduleRef = await Test.createTestingModule(metadata)
    .overrideProvider(overrideProvider)
    .useValue(value)
    .compile()

  const app = moduleRef.createNestApplication()

  return { app, moduleRef }
}

/**
 * Returns a NestJS testing module.
 *
 * - https://docs.nestjs.com/fundamentals/testing#testing-utilities
 *
 * @async
 * @param {ModuleMetadata} metadata - Module metadata
 * @return {Promise<TestingModule>} Promise containing NestJS testing module
 */
export const createTestingModule = async (
  metadata: ModuleMetadata
): Promise<TestingModule> => {
  return await Test.createTestingModule(metadata).compile()
}

/**
 * Clears the data from the `UsersRepository`.
 *
 * @async
 * @return {Promise<void>} Empty promise when complete
 */
export const clearUsersRepository = async (): Promise<void> => {
  const path = USERS_REPO_TEST_PATH

  await DBCONNS.users.request<EmptyObject>(path, { data: {}, method: 'put' })

  return
}

/**
 * Returns a mock `CallHandler` object.
 *
 * @template T - Payload type
 *
 * @param {InterceptorResponse<T>} payload - Mock payload
 * @return {CallHandler<InterceptorResponse<T>>} Mock `CallHandler` object
 */
export function getMockCallHandler<T = any>(
  payload: T
): CallHandler<InterceptorResponse<T>> {
  const mockPayloadPromise = Promise.resolve(payload)

  return { handle: jest.fn().mockReturnValue(mockPayloadPromise) }
}

/**
 * Returns a mock `ExecutionContext` objeect.
 *
 * @param {MockRequest} [req] - MockRequest options
 * @return {ExecutionContext} Mock `ExecutionContext` objeect
 */
export const getMockExecutionContext = (
  req?: MockRequest
): ExecutionContext => {
  const mockRequest = getMockReq(req)
  const context = { switchToHttp: () => ({ getRequest: () => mockRequest }) }

  return context as ExecutionContext
}

/**
 * Loads data into the root of the `UsersRepository`.
 *
 * @template E - Entity
 *
 * @async
 * @param {RepoRoot<E>} data - Repository root data
 * @return {Promise<void>} Empty promise when complete
 */
export async function loadUsersRepository(
  data: RepoRoot<IUser>
): Promise<void> {
  const path = USERS_REPO_TEST_PATH

  await DBCONNS.users.request<RepoRoot<IUser>>(path, { data, method: 'put' })

  return
}

/**
 * Generates a URL path with optional query parameters.
 *
 * @param {Query | PlainObject | NumberString} [poq] - URL path or query params
 * @param {Query | PlainObject} [query] - Query parameters
 * @return {string} Test URL path with stringified query params
 */
export const testURLPath = (
  poq?: Query | PlainObject | NumberString,
  query?: Query | PlainObject
): string => {
  if (!poq || typeof poq === 'number' || typeof poq === 'string') {
    const querystring = query ? `?${qs.stringify(query)}` : ''

    poq = `${poq}`
    if (poq[0] === '/') poq = poq.substring(1, poq.length)

    return `/${poq || ''}${querystring}`
  }

  return `/?${qs.stringify(merge(poq, query))}`
}
