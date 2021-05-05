import { String } from 'runtypes'
import type { ConstraintResultCustom } from '../../../lib/types'
import strongPasswordConstraint from '../utils/passwordConstraint.util'

/**
 * @file Subdomain Model - Password
 * @module app/subdomains/users/Password
 */

/**
 * Returns `true` if {@param value} is a strong password.
 *
 * @param {any} value - Value to test against constraint
 * @return {ConstraintResultCustom} `true` if non-empty string or error message
 */
const constraint = (value: any): ConstraintResultCustom => {
  return strongPasswordConstraint(value, { minSymbols: 0 })
}

export default String.withConstraint(constraint, { name: 'StrongPassword' })
