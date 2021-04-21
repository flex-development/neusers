import type { ValidationError } from 'class-validator'

/**
 * @file Test Fixture - ValidationErrors
 * @module app/lib/repositories/tests/fixtures/validation-errors.fixture
 */

export default [
  {
    constraints: {
      length: '$property must be longer than or equal to 10 characters'
    },
    property: 'title',
    value: 'Hello'
  },
  {
    constraints: {
      contains: 'text must contain a hello string'
    },
    property: 'text',
    value: 'this is a great post about hell world'
  }
] as ValidationError[]
