import type { UserEntity } from '../users.types'

/**
 * @file Subdomain DTO - PatchUserDTO
 * @module app/subdomains/users/dto/PatchUser
 */

export interface PatchUserDTO {
  email?: UserEntity['email']
  first_name?: UserEntity['first_name']
  last_name?: UserEntity['last_name']
  password?: UserEntity['password']
}
