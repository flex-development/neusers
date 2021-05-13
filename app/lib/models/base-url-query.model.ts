import { ApiPropertyOptional } from '@nestjs/swagger'

/**
 * @file Global Model - BaseUrlQuery
 * @module app/lib/models/BaseUrlQuery
 * @see https://docs.nestjs.com/openapi/types-and-parameters
 */

export default class BaseUrlQuery {
  @ApiPropertyOptional({
    description:
      'List of attributes to include. Prefix attribute with `-` to exclude attribute from response',
    example: 'created_at,-updated_at',
    type: 'string'
  })
  fields?: string

  @ApiPropertyOptional({
    description: 'Limit number of results',
    example: '10',
    format: 'number',
    type: 'string'
  })
  limit?: string

  @ApiPropertyOptional({ description: 'Text search', type: 'string' })
  q?: string

  @ApiPropertyOptional({
    description: 'Skips the first n entities',
    example: '10',
    format: 'number',
    type: 'string'
  })
  skip?: string

  @ApiPropertyOptional({
    description:
      'List of attributes to sort results by. Prefix attribute with `-` to sort in descending order',
    example: 'created_at,-id',
    format: 'number',
    type: 'string'
  })
  sort?: string
}
