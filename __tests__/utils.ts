import type { ModuleMetadata } from '@nestjs/common'
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
