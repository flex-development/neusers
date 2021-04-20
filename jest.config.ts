import type { Config } from '@jest/types'
import { jsWithTsESM as preset } from 'ts-jest/presets'
import { pathsToModuleNameMapper } from 'ts-jest/utils'
import pkg from './package.json'
import { compilerOptions } from './tsconfig.json'

/**
 * @file Jest Root Configuration
 * @see https://jestjs.io/docs/next/configuration
 * @see https://orlandobayo.com/blog/monorepo-testing-using-jest/
 */

const prefix = '<rootDir>/'

const config: Config.InitialOptions = {
  ...preset,
  clearMocks: true,
  displayName: pkg.name.split('@flex-development/')[1],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.test.json',
      useESM: true
    }
  },
  moduleDirectories: ['node_modules'],
  moduleFileExtensions: ['js', 'json', 'ts', 'tsx'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix }),
  prettierPath: '<rootDir>/node_modules/prettier',
  roots: [prefix.slice(0, prefix.length - 1)],
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.ts'],
  testPathIgnorePatterns: [
    '__mocks__/',
    '__tests__/__fixtures__/',
    '__tests__/matchers.ts',
    '__tests__/setup.ts',
    '__tests__/utils.ts',
    'node_modules/',
    '(.*).d.ts'
  ],
  verbose: true
}

export default config
