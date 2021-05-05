import type { MockRequest } from '@jest-mock/express/dist/src/request'
import faker from 'faker'
import URI from 'urijs'

/**
 * @file Global Test Fixture - GET request
 * @module tests/fixtures/req-get
 */

export const REQ_GET_URI = new URI('/users?path=users')

export const REQ_GET: MockRequest = {
  headers: {
    host: faker.internet.domainName(),
    'user-agent': faker.internet.userAgent(),
    'x-forwarded-for': faker.internet.ip()
  },
  method: 'get',
  path: REQ_GET_URI.path(),
  url: REQ_GET_URI.valueOf()
}
