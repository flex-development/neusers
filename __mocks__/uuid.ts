import faker from 'faker'

/**
 * @file Mock - uuid
 * @module mocks/uuid
 * @see https://jestjs.io/docs/next/manual-mocks#mocking-node-modules
 * @see https://github.com/uuidjs/uuid
 */

export const v4 = jest.fn(() => faker.datatype.uuid())
