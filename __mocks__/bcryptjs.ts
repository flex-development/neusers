/**
 * @file Mock - bcryptjs
 * @module mocks/bcryptjs
 * @see https://jestjs.io/docs/next/manual-mocks#mocking-node-modules
 * @see https://github.com/dcodeIO/bcrypt.js
 */

export const hash = jest.fn(async (...args) => {
  return await jest.requireActual('bcryptjs').hash(...args)
})
