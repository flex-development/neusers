import type { InterceptorResponse } from '@/lib/types'
import { getMockReq } from '@jest-mock/express'
import type { MockRequest } from '@jest-mock/express/dist/src/request'
import type {
  CallHandler,
  ExecutionContext,
  ModuleMetadata
} from '@nestjs/common'
import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'

/**
 * @file Testing Utilities
 * @module tests/utils
 */

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
