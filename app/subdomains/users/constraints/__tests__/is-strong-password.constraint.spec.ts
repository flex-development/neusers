import type { ValidationArguments } from 'class-validator'
import merge from 'lodash.merge'
import TestSubject from '../is-strong-password.constraint'

/**
 * @file Unit Tests - IsStrongPasswordConstraint
 * @module constraints/tests/IsStrongPasswordConstraint
 */

describe('unit:constraints/IsStrongPasswordConstraint', () => {
  const Subject = new TestSubject()

  /**
   * Returns a mock `ValidationArguments` object.
   *
   * @param {any} [value] - Value being validated
   * @return {ValidationArguments} Mock `ValidationArguments` object
   */
  const mockArgs = (value: any = null): ValidationArguments => {
    const property = 'test'

    const args_base: Partial<ValidationArguments> = {
      constraints: [],
      property,
      targetName: 'Foo'
    }

    const args = merge({}, args_base, { object: { [property]: value }, value })
    return args as ValidationArguments
  }

  describe('#defaultMessage', () => {
    it('should return default error message', () => {
      const expected = '$property is not strong enough; received null'

      expect(Subject.defaultMessage(mockArgs())).toBe(expected)
    })
  })

  describe('#validate', () => {
    it('should return false if value is not strong password', () => {
      const value = 'password'

      expect(Subject.validate(value, mockArgs(value))).toBeFalsy()
    })

    it('should return true if value is strong password', () => {
      const value = 'Strongpassword12345678!'

      expect(Subject.validate(value, mockArgs(value))).toBeTruthy()
    })
  })
})
