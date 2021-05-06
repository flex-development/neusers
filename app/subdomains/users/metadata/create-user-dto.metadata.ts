import type { EntityDTO } from '@flex-development/dreepo/lib/dto/entity.dto'
import merge from 'lodash.merge'
import type { EntitySchemaMetadata } from '../../../lib/types'
import type { UserEntity } from '../users.types'
import UserMeta from './user.metadata'

/**
 * @file Schema Metadata - CreateUserDTO
 * @module app/subdomains/users/metadata/CreateUserDTO
 */

const metadata: EntitySchemaMetadata<EntityDTO<UserEntity>> = merge(UserMeta, {
  password: {
    description:
      'Strong password for the user. Passwords must contain at least 1 lower and uppercase letter, 1 number, and be at least 8 characters'
  }
})

export default metadata
