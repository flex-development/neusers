import type { OneOrMany, PartialOr } from '@flex-development/dreepo'
import { CreateUserDTO, PatchUserDTO } from '../dto'
import type { UserQuery } from '../users.types'
import type { IUser } from './user.interface'
import type { IUsersRepository } from './users-repository.interface'

/**
 * @file Users Subdomain Interface - IUsersService
 * @module app/subdomains/users/interfaces/UsersService
 */

export interface IUsersService {
  readonly repo: IUsersRepository

  create(dto: CreateUserDTO): Promise<IUser>
  delete(id: OneOrMany<IUser['id']>, should_exist?: boolean): Promise<typeof id>
  find(query?: UserQuery): Promise<Partial<IUser>[]>
  findOne(user: string, query?: UserQuery): Promise<PartialOr<IUser>>
  patch(id: IUser['id'], dto: PatchUserDTO, rfields?: string[]): Promise<IUser>
}
