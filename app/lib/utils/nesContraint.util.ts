import isPlainObject from 'lodash.isplainobject'
import type { IsLengthOptions } from 'validator/lib/isLength'
import isLength from 'validator/lib/isLength'
import type { ConstraintResultCustom } from '../types'

/**
 * @file Implementation - nonEmptyStringContraint
 * @module  app/lib/utils/nonEmptyStringContraint
 * @see https://github.com/pelotom/runtypes#constraint-checking
 * @see https://github.com/validatorjs/validator.js
 */

/**
 * Returns `true` if {@param value} is a string with at least one character.
 *
 * If defined, {@param options.min} will be overridden and set to `1`.
 *
 * @param {any} value - Value to test against constraint
 * @param {IsLengthOptions} [options] - Validation options
 * @return {ConstraintResultCustom} `true` if non-empty string or error message
 */
const nonEmptyStringContraint = (
  value: any,
  options?: IsLengthOptions
): ConstraintResultCustom => {
  const _value = (typeof value === 'string' ? value : '').trim()

  const nes = isLength(_value, {
    ...(isPlainObject(options) ? options : {}),
    min: 1
  })

  return nes || 'Value should be a non-empty string'
}

export default nonEmptyStringContraint
