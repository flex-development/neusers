import type { ValidateByOptions, ValidationOptions } from 'class-validator'
import { ValidateBy } from 'class-validator'
import type v from 'validator'
import validator from '../constraints/is-strong-password.constraint'

/**
 * @file Decorator - IsStrongPassword
 * @module decorators/IsStrongPassword
 */

/**
 * Custom decorator that ensures a value is a [strong password][1].
 *
 * [1]: https://github.com/validatorjs/validator.js#validators
 *
 * @param {v.strongPasswordOptions} [options] - Strong password options
 * @param {ValidationOptions} [validationOptions] - Validation options
 * @return {PropertyDecorator} Property decorator
 */
const IsStrongPassword = (
  options?: v.strongPasswordOptions,
  validationOptions?: ValidationOptions
): PropertyDecorator => {
  const validateByOptions: ValidateByOptions = {
    async: validator.options?.async,
    constraints: [options],
    name: validator.options?.name as string,
    validator
  }

  return ValidateBy(validateByOptions, validationOptions)
}

export default IsStrongPassword
