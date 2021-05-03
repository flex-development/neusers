/**
 * @file Mock - repoPath
 * @module app/lib/utils/mocks/repoPath
 * @see https://jestjs.io/docs/next/manual-mocks#mocking-user-modules
 */

export default jest.fn((...args) => {
  return jest.requireActual('@/lib/utils/repoPath.util').default(...args)
})
