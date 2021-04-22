import { ExceptionStatus } from '@neusers/lib/enums'
import AppException from '@neusers/lib/exceptions/app.exception'
import type { AppExceptionJSON } from '@neusers/lib/interfaces'
import type { PlainObject } from 'simplytyped'
import subject from '../repoPath.util'

/**
 * @file Unit Tests - repoPath
 * @module app/lib/utils/tests/repoPath
 */

describe('app/lib/utils/repoPath', () => {
  it('returns database repository path', () => {
    const name = 'objects'

    expect(subject(name)).toMatch(new RegExp(`_${name}`))
  })

  describe('throws error', () => {
    it('empty string', () => {
      const name = ''

      let exception = {} as AppException

      try {
        subject(name)
      } catch (error) {
        exception = error
      }

      expect(exception.constructor.name).toBe('AppException')

      const ejson = exception.getResponse() as AppExceptionJSON

      expect(ejson.code).toBe(ExceptionStatus.INTERNAL_SERVER_ERROR)
      expect((ejson.errors as PlainObject).name).toBe(name)
    })

    it('nullable', () => {
      const name = (undefined as unknown) as string

      let exception = {} as AppException

      try {
        subject(name)
      } catch (error) {
        exception = error
      }

      expect(exception.constructor.name).toBe('AppException')

      const ejson = exception.getResponse() as AppExceptionJSON

      expect(ejson.code).toBe(ExceptionStatus.INTERNAL_SERVER_ERROR)
      expect((ejson.errors as PlainObject).name).toBe(null)
    })
  })
})
