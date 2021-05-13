import { ApiPropertyOptional } from '@nestjs/swagger'
import { BaseUrlQuery, OPENAPI_GLOBALS } from '../../../lib'
import type { UserQuery } from '../users.types'

/**
 * @file Users Subdomain Model - UserUrlQuery
 * @module app/subdomains/users/UserUrlQuery
 */

export default class UserUrlQuery extends BaseUrlQuery implements UserQuery {
  @ApiPropertyOptional({
    externalDocs: OPENAPI_GLOBALS.externalDocs.Filtering,
    type: 'string'
  })
  created_at?: UserQuery['created_at']

  @ApiPropertyOptional({
    externalDocs: OPENAPI_GLOBALS.externalDocs.Filtering,
    type: 'string'
  })
  email?: UserQuery['email']

  @ApiPropertyOptional({
    externalDocs: OPENAPI_GLOBALS.externalDocs.Filtering,
    type: 'string'
  })
  first_name?: UserQuery['first_name']

  @ApiPropertyOptional({
    externalDocs: OPENAPI_GLOBALS.externalDocs.Filtering,
    type: 'string'
  })
  id?: UserQuery['id']

  @ApiPropertyOptional({
    externalDocs: OPENAPI_GLOBALS.externalDocs.Filtering,
    type: 'string'
  })
  last_name?: UserQuery['last_name']

  @ApiPropertyOptional({
    externalDocs: OPENAPI_GLOBALS.externalDocs.Filtering,
    type: 'string'
  })
  password?: UserQuery['password']

  @ApiPropertyOptional({
    externalDocs: OPENAPI_GLOBALS.externalDocs.Filtering,
    type: 'string'
  })
  updated_at?: UserQuery['updated_at']
}
