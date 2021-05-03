import faker from 'faker'

/**
 * @file Mock - bcryptjs
 * @module mocks/bcryptjs
 * @see https://jestjs.io/docs/next/manual-mocks#mocking-node-modules
 * @see https://github.com/dcodeIO/bcrypt.js
 */

export const hashSync = jest.fn(s => `${faker.datatype.uuid()}_${s}`)
