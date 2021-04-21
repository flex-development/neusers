import type { SearchOptions } from '@algolia/client-search'
import { IsBoolean, IsNumber, IsOptional, IsString, Min } from 'class-validator'

/**
 * @file Global Models - SearchParams
 * @module app/lib/models/SearchParams
 */

export default class SearchParams {
  @IsString({ each: true })
  @IsOptional()
  attributesToRetrieve?: SearchOptions['attributesToRetrieve']

  @IsBoolean()
  @IsOptional()
  decompoundQuery?: SearchOptions['decompoundQuery']

  @IsString({ each: true })
  @IsOptional()
  disableTypoToleranceOnAttributes?: SearchOptions['disableTypoToleranceOnAttributes']

  @IsString()
  @IsOptional()
  filters?: SearchOptions['filters']

  @IsNumber({ allowNaN: false, maxDecimalPlaces: 0 })
  @Min(1)
  @IsOptional()
  hitsPerPage?: SearchOptions['hitsPerPage']

  @IsNumber({ allowNaN: false, maxDecimalPlaces: 0 })
  @Min(1)
  @IsOptional()
  length?: SearchOptions['length']

  @IsString()
  @IsOptional()
  objectID?: SearchOptions['filters']

  @IsNumber({ allowNaN: false, maxDecimalPlaces: 0 })
  @Min(0)
  @IsOptional()
  offset?: SearchOptions['offset']

  @IsString({ each: true })
  @IsOptional()
  optionalWords?: SearchOptions['optionalWords']

  @IsNumber({ allowNaN: false, maxDecimalPlaces: 0 })
  @Min(1)
  @IsOptional()
  page?: SearchOptions['page']

  @IsString()
  @IsOptional()
  query?: SearchOptions['query']

  @IsString({ each: true })
  @IsOptional()
  responseFields?: SearchOptions['responseFields']

  @IsString()
  @IsOptional()
  userToken?: SearchOptions['userToken']
}
