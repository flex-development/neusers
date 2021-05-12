import { HttpStatus } from '@nestjs/common'
import { CONF } from '../../config/configuration'
import { ExceptionJSON } from '../../lib'
import { PartialUser, User } from './models'

/**
 * @file Subdomain OpenAPI Docs - Users
 * @module app/subdomains/users/openapi
 * @see https://docs.nestjs.com/openapi/introduction
 */

export default {
  controller: CONF.SUBDOMAINS.users.endpoint,
  tags: ['users'],
  create: {
    status: HttpStatus.CREATED,
    responses: {
      201: { description: 'Created new user', type: User },
      400: { description: 'Schema validation error', type: ExceptionJSON },
      409: {
        description: 'User with email or id already exists',
        type: ExceptionJSON
      }
    }
  },
  delete: {
    status: HttpStatus.NO_CONTENT,
    responses: {
      204: { description: 'Deleted user' },
      401: {
        description: 'User not logged in',
        type: ExceptionJSON
      }
    }
  },
  find: {
    status: HttpStatus.OK,
    query: {},
    responses: {
      200: {
        description: 'Successfully queried database',
        isArray: true,
        type: PartialUser
      },
      400: {
        description: 'Error executing query',
        type: ExceptionJSON
      }
    }
  },
  findOne: {
    status: HttpStatus.OK,
    query: {},
    responses: {
      200: {
        description: 'Found user by ID or email address',
        type: PartialUser
      },
      400: {
        description: 'Error executing query',
        type: ExceptionJSON
      },
      404: { description: 'User not found', type: ExceptionJSON }
    }
  },
  patch: {
    status: HttpStatus.OK,
    responses: {
      200: { description: 'Successfully updated user', type: User },
      400: { description: 'Schema validation error', type: ExceptionJSON },
      409: {
        description: 'User with email already exists',
        type: ExceptionJSON
      }
    }
  }
}
