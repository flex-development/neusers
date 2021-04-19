/**
 * @file Lint Staged Configuration
 * @see https://github.com/okonet/lint-staged
 */

module.exports = {
  /**
   * Formating and linting commands for all files.
   */
  [`*.{js,json,md,ts}`]: ['yarn format', 'git add -A'],

  /**
   * Formating and linting commands for JavaScript and TypeScript files.
   */
  [`*.{js,ts}`]: ['yarn lint', 'git add -A']
}
