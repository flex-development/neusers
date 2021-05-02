import AppException from '@/lib/exceptions/app.exception'
import { ExceptionStatusCode } from '@flex-development/exceptions/enums'
import type { ExceptionJSON } from '@flex-development/exceptions/interfaces'
import type { PlainObject } from 'simplytyped'
import subject from '../repoPath.util'

/**
 * @file Unit Tests - repoPath
 * @module app/lib/utils/tests/repoPath
 */

describe('app/lib/utils/repoPath', () => {
  it('should return database repository path', () => {
    const name = 'objects'

    expect(subject(name)).toMatch(new RegExp(`_${name}`))
  })

  describe('should throw', () => {
    it('should throw if name is empty string', () => {
      const name = ''

      let exception = {} as AppException

      try {
        subject(name)
      } catch (error) {
        exception = error
      }

      expect(exception.constructor.name).toBe('AppException')

      const ejson = exception.getResponse() as ExceptionJSON

      expect(ejson.code).toBe(ExceptionStatusCode.INTERNAL_SERVER_ERROR)
      expect((ejson.errors as PlainObject).name).toBe(name)
    })

    it('should throw if name is nullable', () => {
      const name = (undefined as unknown) as string

      let exception = {} as AppException

      try {
        subject(name)
      } catch (error) {
        exception = error
      }

      expect(exception.constructor.name).toBe('AppException')

      const ejson = exception.getResponse() as ExceptionJSON

      expect(ejson.code).toBe(ExceptionStatusCode.INTERNAL_SERVER_ERROR)
      expect((ejson.errors as PlainObject).name).toBe(null)
    })
  })
})
