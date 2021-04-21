import { IsOptional, IsString, IsUUID } from 'class-validator'
import { IEntity } from '../interfaces/entity.interface'

/**
 * @file Global Models - Entity
 * @module app/lib/models/Entity
 */

export default class Entity implements IEntity {
  @IsString()
  created_at: IEntity['created_at']

  @IsUUID()
  id: IEntity['id']

  @IsString()
  @IsOptional()
  updated_at: IEntity['updated_at']
}
