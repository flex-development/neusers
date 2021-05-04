import type validator from 'validator'
import isStrongPassword from 'validator/lib/isStrongPassword'
import type { ConstraintResultCustom } from '../../../lib/types'

/**
 * @file Implementation - strongPasswordConstraint
 * @module app/subdomains/users/utils/strongPasswordConstraint
 * @see https://github.com/pelotom/runtypes#constraint-checking
 * @see https://github.com/validatorjs/validator.js
 */

/**
 * Returns `true` if {@param value} is a strong password.
 *
 * @param {any} value - Value to test against constraint
 * @param {validator.strongPasswordOptions} [options] - Validation options
 * @return {ConstraintResultCustom} `true` if non-empty string or error message
 */
const strongPasswordConstraint = (
  value: any,
  options?: validator.strongPasswordOptions
): ConstraintResultCustom => {
  const _value = typeof value === 'string' ? value : ''

  const password = isStrongPassword(_value, options)

  return password || 'Weak password'
}

export default strongPasswordConstraint
