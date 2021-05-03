import type { RepoRoot } from '@flex-development/dreepo/lib/types'
import type { UserEntity } from '../../users.types'
import ROOT from './users-root.fixture.json'

/**
 * @file Test Fixture - Users
 * @module app/subdomains/users/tests/fixtures/users.fixture
 */

export const USERS_ROOT: Readonly<RepoRoot<UserEntity>> = Object.freeze(ROOT)
export const USERS: UserEntity[] = Object.values(USERS_ROOT)

export const USERS_MOCK_CACHE_EMPTY = Object.freeze({
  collection: Object.freeze([]),
  root: Object.freeze({})
})

export const USERS_MOCK_CACHE = Object.freeze({
  collection: Object.freeze(USERS),
  root: USERS_ROOT
})
