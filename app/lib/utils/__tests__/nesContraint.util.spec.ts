import faker from 'faker'
import testSubject from '../nesContraint.util'

/**
 * @file Unit Tests - nesContraint
 * @module app/lib/utils/tests/nesContraint
 */

describe('unit:app/lib/utils/nesContraint', () => {
  it('should return error message if value is empty', () => {
    const value = null

    expect(testSubject(value)).toMatch('should be a non-empty string')
  })

  it('should return true if value is non-empty string', () => {
    const value = faker.random.words(13)

    expect(testSubject(value)).toBeTruthy()
  })
})
