import { ExceptionStatusCode } from '@flex-development/exceptions/enums'
import { CONF } from '../../config/configuration'
import AppException from '../exceptions/app.exception'
import type { OrNever } from '../types'

/**
 * @file Implementation - repoPath
 * @module app/lib/utils/repoPath
 */

/**
 * Prefixes {@param name} with the current Node environment followed by an
 * underscore (_). In `preview` Vercel environments, the current Vercel
 * environment will be used instead.
 *
 * @param {string} name - Collection name
 * @return {OrNever<string>} Database repository path
 * @throws {AppException}
 */
const repoPath = (name: string): OrNever<string> => {
  if (typeof name !== 'string' || !name.trim().length) {
    const code = ExceptionStatusCode.INTERNAL_SERVER_ERROR
    const message = 'Invalid collection name'
    const data = { errors: { name: typeof name === 'undefined' ? null : name } }

    throw new AppException(code, message, data)
  }

  return `${CONF.PREVIEW ? CONF.VERCEL_ENV : CONF.NODE_ENV}_${name}`
}

export default repoPath
