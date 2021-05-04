import testSubject from '../passwordConstraint.util'

/**
 * @file Unit Tests - passwordConstraint
 * @module app/subdomains/users/utils/tests/passwordConstraint
 */

describe('unit:app/subdomains/users/utils/passwordConstraint', () => {
  it('should return error message if password is weak', () => {
    const value = 'string'

    expect(testSubject(value)).toBe('Weak password')
  })

  it('should return true if password is strong', () => {
    const value = `Strongpassword1234678`

    expect(testSubject(value)).toBeTruthy()
  })
})
