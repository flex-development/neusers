import { IsNumber, IsOptional, IsString } from 'class-validator'
import { IEntity } from '../interfaces/entity.interface'

/**
 * @file Global Model - Entity
 * @module app/lib/models/Entity
 */

export default class Entity implements IEntity {
  @IsNumber()
  created_at: IEntity['created_at']

  @IsString()
  id: IEntity['id']

  @IsNumber()
  @IsOptional()
  updated_at: IEntity['updated_at']
}
