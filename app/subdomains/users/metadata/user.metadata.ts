import type { EntitySchemaMetadata } from '../../../lib/types'
import type { UserEntity } from '../users.types'

/**
 * @file Schema Metadata - User Model
 * @module app/subdomains/users/metadata/User
 */

const metadata: EntitySchemaMetadata<UserEntity> = {
  created_at: {
    description: 'Date and time entity was created',
    type: 'number'
  },
  email: {
    description:
      'Unique email address for the user. Attempting to assign the same email to multiple users returns an error',
    format: 'email',
    type: 'string'
  },
  first_name: {
    description: "User's first name",
    minLength: 1,
    type: 'string'
  },
  id: {
    description: 'Unique identifier for the user',
    type: 'string'
  },
  last_name: {
    description: "User's last name",
    minLength: 1,
    type: 'string'
  },
  password: {
    description:
      'Hashed password. Passwords must be contain at least 1 lower and uppercase letter, 1 number, and be at least 8 characters',
    minimum: 8,
    type: 'string'
  },
  updated_at: {
    description: 'Date and time entity was last modified',
    type: 'number'
  }
}

export default metadata
