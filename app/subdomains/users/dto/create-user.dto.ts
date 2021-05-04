import type { EntityDTO } from '@flex-development/dreepo/lib/dto/entity.dto'
import type { UserEntity } from '../users.types'

/**
 * @file Subdomain DTO - CreateUserDTO
 * @module app/subdomains/users/dto/CreateUser
 */

export interface CreateUserDTO extends EntityDTO<UserEntity> {
  email: UserEntity['email']
  first_name: UserEntity['first_name']
  last_name: UserEntity['last_name']
  password: UserEntity['password']
}
