import { isType } from 'type-plus'
import type { IsEmailOptions } from 'validator/lib/isEmail'
import isEmail from 'validator/lib/isEmail'
import type { ConstraintResultCustom } from '../types'

/**
 * @file Implementation - emailConstraint
 * @module app/lib/utils/emailConstraint
 * @see https://github.com/pelotom/runtypes#constraint-checking
 */

/**
 * Returns `true` if {@param value} is an email address, or an error message.
 *
 * @param {any} value - Value to test against constraint
 * @param {IsEmailOptions} [options] - Validation options
 * @return {ConstraintResultCustom} `true` if email, error message otherwise
 */
const emailConstraint = (
  value: any,
  options?: IsEmailOptions
): ConstraintResultCustom => {
  const email = isEmail(typeof value === 'string' ? value : '')

  if (email) return email

  let message = `${email} is not a valid email address`

  if (isType<IsEmailOptions>(options as any)) {
    message += `; options: ${JSON.stringify(options)}`
  }

  return message
}

export default emailConstraint
