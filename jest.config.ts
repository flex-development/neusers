import type { Config } from '@jest/types'
import baseConfig from './jest.config.base'
import pkg from './package.json'

/**
 * @file Jest Root Configuration
 * @see https://jestjs.io/docs/next/configuration
 */

const config: Config.InitialOptions = {
  ...baseConfig,
  displayName: pkg.name.split('@flex-development/')[1]
}

export default config
