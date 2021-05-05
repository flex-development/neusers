import { ExceptionStatusCode } from '@flex-development/exceptions/enums'
import Exception from '@flex-development/exceptions/exceptions/base.exception'
import type { PlainObject } from 'simplytyped'
import testSubject from '../repoPath.util'

/**
 * @file Unit Tests - repoPath
 * @module app/lib/utils/tests/repoPath
 */

describe('unit:app/lib/utils/repoPath', () => {
  it('should return database repository path', () => {
    const name = 'objects'

    expect(testSubject(name)).toMatch(new RegExp(`/${name}`))
  })

  describe('should throw', () => {
    it('should throw if repository name is empty string', () => {
      const name = ''

      let exception = {} as Exception

      try {
        testSubject(name)
      } catch (error) {
        exception = error
      }

      expect(exception.constructor.name).toBe('Exception')

      const ejson = exception.toJSON()

      expect(ejson.code).toBe(ExceptionStatusCode.INTERNAL_SERVER_ERROR)
      expect((ejson.errors as PlainObject).name).toBe(name)
    })

    it('should throw if repository name is nullable', () => {
      const name = (undefined as unknown) as string

      let exception = {} as Exception

      try {
        testSubject(name)
      } catch (error) {
        exception = error
      }

      expect(exception.constructor.name).toBe('Exception')

      const ejson = exception.toJSON()

      expect(ejson.code).toBe(ExceptionStatusCode.INTERNAL_SERVER_ERROR)
      expect((ejson.errors as PlainObject).name).toBe(null)
    })
  })
})
