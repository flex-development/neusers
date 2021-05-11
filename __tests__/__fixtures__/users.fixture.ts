import type { IUser } from '@/subdomains/users/interfaces'
import type { RepoRoot } from '@flex-development/dreepo'
import ROOT from './users-root.fixture.json'

/**
 * @file Global Test Fixture - Users
 * @module tests/fixtures/users.fixture
 */

export const USERS_ROOT: Readonly<RepoRoot<IUser>> = Object.freeze(ROOT)
export const USERS: IUser[] = Object.values(USERS_ROOT)

export const USERS_MOCK_CACHE_EMPTY = Object.freeze({
  collection: Object.freeze([]),
  root: Object.freeze({})
})

export const USERS_MOCK_CACHE = Object.freeze({
  collection: Object.freeze(USERS),
  root: USERS_ROOT
})
