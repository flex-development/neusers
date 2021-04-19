const merge = require('lodash').merge
const { resolve } = require('path')
const {
  compilerOptions: { outDir }
} = require('./tsconfig.json')

/**
 * @file Custom Webpack Configuration
 * @see https://github.com/nestjs/nest/issues/4721
 * @see https://webpack.js.org/configuration
 */

module.exports = config => {
  return merge(config, { output: { path: resolve(__dirname, outDir) } })
}
