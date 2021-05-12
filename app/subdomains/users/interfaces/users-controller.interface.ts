import type { PartialOr } from '@flex-development/dreepo'
import { CreateUserDTO, PatchUserDTO } from '../dto'
import type { UserQueryParams } from '../users.types'
import type { IUser } from './user.interface'
import type { IUsersService } from './users-service.interface'

/**
 * @file Users Subdomain Interface - IUsersController
 * @module app/subdomains/users/interfaces/UsersController
 */

export interface IUsersController {
  readonly users: IUsersService

  create(dto: CreateUserDTO): Promise<IUser>
  delete(id: IUser['id']): Promise<void>
  find(query?: UserQueryParams): Promise<Partial<IUser>[]>
  findOne(
    user: IUser['email'] | IUser['id'],
    authorized?: boolean,
    query?: UserQueryParams
  ): Promise<PartialOr<IUser>>
  patch(id: IUser['id'], dto: PatchUserDTO, rfields?: string[]): Promise<IUser>
}
