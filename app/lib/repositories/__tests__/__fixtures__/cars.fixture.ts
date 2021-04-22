import type { IEntity } from '@neusers/lib/interfaces/entity.interface'
import Entity from '@neusers/lib/models/entity.model'
import repoPath from '@neusers/lib/utils/repoPath.util'
import { IsNumber, IsString } from 'class-validator'
import { Collection } from 'fireorm/lib/src/Decorators/Collection'

/**
 * @file Test Fixture - Cars
 * @module app/lib/repositories/tests/fixtures/cars.fixture
 */

export interface ICar extends IEntity {
  make: string
  model: string
  model_year: number
}

export const CARS_INDEX_NAME = 'cars'

@Collection(repoPath(CARS_INDEX_NAME))
export class Car extends Entity implements ICar {
  @IsString()
  make: ICar['make']

  @IsString()
  model: ICar['model']

  @IsNumber()
  model_year: ICar['model_year']
}

export const CARS_ROOT: Record<
  ICar['id'],
  Omit<ICar, 'created_at' | 'updated_at'>
> = {
  JH4DC54805S081355: {
    id: 'JH4DC54805S081355',
    make: 'Mitsubishi',
    model: '3000GT',
    model_year: 1995
  },
  KMHTC6AD5FU539428: {
    id: 'KMHTC6AD5FU539428',
    make: 'Honda',
    model: 'CR-V',
    model_year: 2007
  },
  SCFFDAAE2BG795532: {
    id: 'SCFFDAAE2BG795532',
    make: 'Mercury',
    model: 'Cougar',
    model_year: 1967
  },
  TRUWT28N141705117: {
    id: 'TRUWT28N141705117',
    make: 'Volkswagen',
    model: 'Passat',
    model_year: 2001
  },
  WAUVT68E05A682764: {
    id: 'WAUVT68E05A682764',
    make: 'Ford',
    model: 'F-Series',
    model_year: 1986
  }
}
