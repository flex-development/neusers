const { Rule, RuleConfigTuple } = require('@commitlint/types')
const { readdirSync } = require('fs')
const { resolve } = require('path')
const { Record } = require('typescript')

/**
 * @file Commitlint Configuration
 * @see https://commitlint.js.org/#/guides-local-setup
 * @see https://www.conventionalcommits.org/en/v1.0.0/#specification
 */

module.exports = {
  /**
   * @property {boolean} defaultIgnores - If true, enable default ignore rules
   */
  defaultIgnores: true,

  /**
   * @property {Array<string>} extends - IDs of commitlint configurations
   *
   * @see https://www.conventionalcommits.org/
   * @see https://www.npmjs.com/package/@commitlint/config-conventional
   */
  extends: ['@commitlint/config-conventional'],

  /**
   * @property {string} formatter - Name of formatter package
   */
  formatter: '@commitlint/format',

  /**
   * Functions that return true if commitlint should ignore the given message.
   *
   * @param {string} commit - The commit message
   * @return {boolean} `true` if commitlint should ignore message
   */
  ignores: [
    /**
     * Ignores commit messages that begin with "wip" as the scope or type.
     *
     * @param {string} commit - The commit message
     * @return {boolean} True if message begins with "wip" as the scope or type
     */
    commit => [':', '('].some(char => commit.startsWith(`wip${char}`)),

    /**
     * Ignores commit messages that start with "<METHOD> /" where `<METHOD>` is
     * one of the following HTTP request methods:
     *
     * - `DELETE`
     * - `GET`
     * - `PATCH`
     * - `POST`
     * - `PUT`
     *
     * @param {string} commit - The commit message
     * @return {boolean} True if message begins with `<METHOD> /`
     */
    commit => {
      const METHODS = ['DELETE', 'GET', 'PATCH', 'POST', 'PUT']
      const TEST = commit.split(': ')[1].toUpperCase()

      return METHODS.some(method => TEST.startsWith(`${method} /`))
    }
  ],

  /**
   * @property {Record<string, Rule>} rules - Rules to check against
   *
   * @see https://commitlint.js.org/#/reference-rules
   */
  rules: {
    /**
     * Scope syntax.
     */
    'scope-case': [2, 'always', 'kebab-case'],

    /**
     * Returns the rules for valid commit scopes.
     *
     * @return {Promise<RuleConfigTuple>} Scope rules
     */
    'scope-enum': () => {
      const APP = resolve(__dirname, 'app')

      const directories = arr => arr.filter(d => d.isDirectory())

      const app = directories(readdirSync(APP))
      const subdomains = directories(readdirSync(resolve(APP, 'subdomains')))

      return [2, 'always', [...app, ...subdomains, 'types']]
    }
  }
}
