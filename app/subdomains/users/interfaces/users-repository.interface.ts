import type { IRepository, OrNever, PartialOr } from '@flex-development/dreepo'
import type { OnModuleInit } from '@nestjs/common'
import type { Merge } from 'simplytyped'
import { CreateUserDTO, PatchUserDTO } from '../dto'
import type { UserParams, UserQuery } from '../users.types'
import type { IUser } from './user.interface'

/**
 * @file Users Subdomain Interface - IUsersRepository
 * @module app/subdomains/users/interfaces/UsersRepository
 */

export interface IUsersRepository
  extends Merge<IRepository<IUser, UserParams, UserQuery>, OnModuleInit> {
  onModuleInit(): Promise<void>
  create(dto: CreateUserDTO): OrNever<Promise<IUser>>
  findOneByEmail(
    email: IUser['email'],
    params?: UserParams,
    exists?: boolean
  ): PartialOr<IUser> | null
  patch(
    id: IUser['id'],
    dto: PatchUserDTO,
    rfields?: string[]
  ): OrNever<Promise<IUser>>
  queryOneByEmail(
    email: IUser['email'],
    query?: UserQuery,
    exists?: boolean
  ): PartialOr<IUser> | null
}
