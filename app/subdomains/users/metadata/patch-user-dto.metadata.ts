import type { EntityDTO } from '@flex-development/dreepo'
import merge from 'lodash.merge'
import type { EntitySchemaMetadata } from '../../../lib/types'
import type { IUser } from '../interfaces'
import UserMeta from './user.metadata'

/**
 * @file Schema Metadata - PatchUserDTO
 * @module app/subdomains/users/metadata/PatchUserDTO
 */

const metadata: EntitySchemaMetadata<EntityDTO<IUser>> = merge(UserMeta, {
  created_at: {
    required: false
  },
  email: {
    required: false
  },
  first_name: {
    required: false
  },
  id: {
    required: false
  },
  last_name: {
    required: false
  },
  password: {
    description:
      'Strong password for the user. Passwords must contain at least 1 lower and uppercase letter, 1 number, and be at least 8 characters',
    required: false
  }
})

export default metadata
