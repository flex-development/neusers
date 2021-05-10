import type { ValidatorConstraintOptions } from '@flex-development/dreepo'
import type {
  ValidationArguments,
  ValidatorConstraintInterface as IConstraint
} from 'class-validator'
import { ValidatorConstraint as Constraint } from 'class-validator'
import isStrongPassword from 'validator/lib/isStrongPassword'

/**
 * @file Constraints - IsStrongPasswordConstraint
 * @module constraints/IsStrongPasswordConstraint
 * @see https://github.com/typestack/class-validator#custom-validation-classes
 */

@Constraint(IsStrongPasswordConstraint.options)
export default class IsStrongPasswordConstraint implements IConstraint {
  /**
   * @static
   * @readonly
   * @property {ValidatorConstraintOptions} options - Custom constraint options
   */
  static readonly options: ValidatorConstraintOptions = {
    async: false,
    name: 'isStrongPassword'
  }

  /**
   * Returns the default error message if constraint validation fails.
   *
   * @param {ValidationArguments} args - Arguments sent to message builders
   * @return {string} Default error message
   */
  defaultMessage(args: ValidationArguments): string {
    return `$property is not strong enough; received ${args.value}`
  }

  /**
   * Returns `true` if {@param value} is a strong password.
   *
   * If defined, {@param args.constraints[0]} can be used to pass additional
   * password validation options.
   *
   * @param {any} value - Value to test against constraint
   * @param {ValidationArguments} args - Arguments sent to message builders
   * @return {boolean} Boolean indicating value is strong password
   */
  validate(value: any, args: ValidationArguments): boolean {
    if (typeof value !== 'string') return false
    return isStrongPassword(value, args.constraints[0])
  }
}
