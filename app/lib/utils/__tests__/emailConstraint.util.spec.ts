import faker from 'faker'
import testSubject from '../emailConstraint.util'

/**
 * @file Unit Tests - emailConstraint
 * @module app/lib/utils/tests/emailConstraint
 */

describe('unit:app/lib/utils/emailConstraint', () => {
  it('should return error message if value is not email address', () => {
    const value = 'string'

    expect(testSubject(value)).toMatch('is not a valid email address')
  })

  it('should return true if value is email address', () => {
    const value = faker.internet.exampleEmail()

    expect(testSubject(value)).toBeTruthy()
  })
})
