import AUTHORIZATION_HEADER from '@/subdomains/users/providers/__tests__/__fixtures__/authorization.fixture'
import { USERS_MOCK_CACHE } from '@/subdomains/users/providers/__tests__/__fixtures__/users.fixture'
import type { MockRequest } from '@jest-mock/express/dist/src/request'
import { REQ_GET } from '@tests/fixtures/req-get.fixture'
import merge from 'lodash.merge'
import URI from 'urijs'

/**
 * @file Test Fixture - Authenticated Request
 * @module app/subdomains/users/interceptors/tests/fixtures/req-auth.fixture
 */

export const AUTH_REQ_USER = Object.freeze(USERS_MOCK_CACHE.collection[0])

export const AUTH_REQ_URI = new URI(`/users/${AUTH_REQ_USER.id}`)

export const AUTH_REQ: MockRequest = merge(REQ_GET, {
  headers: { authorization: AUTHORIZATION_HEADER },
  params: {},
  path: AUTH_REQ_URI.path(),
  url: AUTH_REQ_URI.valueOf()
})
