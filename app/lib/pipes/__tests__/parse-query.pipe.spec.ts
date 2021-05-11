import type { IUser } from '@/subdomains/users/interfaces'
import { ExceptionStatusCode } from '@flex-development/exceptions/enums'
import Exception from '@flex-development/exceptions/exceptions/base.exception'
import type { Paramtype } from '@nestjs/common'
import merge from 'lodash.merge'
import TestSubject from '../parse-query.pipe'

/**
 * @file Unit Tests - ParseQueryPipe
 * @module app/lib/pipes/tests/ParseQueryPipe
 */

describe('unit:app/lib/pipes/ParseQueryPipe', () => {
  const Subject = new TestSubject<IUser>()
  const metadata = { type: 'query' as Paramtype }

  describe('#transform', () => {
    it("should return value if metadata.type !== 'query'", () => {
      const value = null

      expect(Subject.transform(value, { type: 'body' })).toBe(value)
    })

    it('should throw Exception if value is not plain object', () => {
      const value = []

      const pattern = `Query parameters must be an object; received ${value}`
      const emessage = new RegExp(pattern)

      let exception = {} as Exception

      try {
        Subject.transform(value, metadata)
      } catch (error) {
        exception = error
      }

      expect(exception.code).toBe(ExceptionStatusCode.BAD_REQUEST)
      expect(exception.errors).toMatchObject({ value })
      expect(exception.message).toMatch(emessage)
    })

    it('should parse key values that are are json strings', () => {
      const value = { email: 'true' }

      const query = Subject.transform(value, metadata)

      expect(typeof query.email === 'boolean').toBeTruthy()
    })

    it('should remove path parameter', () => {
      const value = { path: 'users' }

      expect(Subject.transform(value, metadata)).toMatchObject({})
    })

    it('should handle decorator argument', () => {
      const data = 'updated_at'
      const value = { [data]: '1620232058179' }
      const this_metadata = merge({}, metadata, { data })

      const expected = value[this_metadata.data]

      expect(Subject.transform(value, this_metadata)).toBe(expected)
    })
  })
})
