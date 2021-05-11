import type { EntityDTO } from '@flex-development/dreepo'
import merge from 'lodash.merge'
import type { SchemaMetadata } from '../../../lib'
import type { IUser } from '../interfaces'
import UserMeta from './user.metadata'

/**
 * @file Schema Metadata - CreateUserDTO
 * @module app/subdomains/users/metadata/CreateUserDTO
 */

const metadata: SchemaMetadata<EntityDTO<IUser>> = merge(UserMeta, {
  password: {
    description:
      'Strong password for the user. Passwords must contain at least 1 lower and uppercase letter, 1 number, and be at least 8 characters'
  }
})

export default metadata
