import type { IRepository, OrNever, PartialOr } from '@flex-development/dreepo'
import type { OnModuleInit } from '@nestjs/common'
import type { Merge } from 'simplytyped'
import { CreateUserDTO, PatchUserDTO } from '../dto'
import type { UserQueryParams } from '../users.types'
import type { IUser } from './user.interface'

/**
 * @file Users Subdomain Interface - IUsersRepository
 * @module app/subdomains/users/interfaces/UsersRepository
 */

export interface IUsersRepository
  extends Merge<IRepository<IUser, UserQueryParams>, OnModuleInit> {
  onModuleInit(): Promise<void>
  create(dto: CreateUserDTO): OrNever<Promise<IUser>>
  findOneByEmail(
    email: IUser['email'],
    params?: UserQueryParams,
    exists?: boolean
  ): PartialOr<IUser> | null
  patch(
    id: IUser['id'],
    dto: PatchUserDTO,
    rfields?: string[]
  ): OrNever<Promise<IUser>>
}
