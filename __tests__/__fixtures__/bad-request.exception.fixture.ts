import { BadRequestException } from '@nestjs/common/exceptions'
import type { HttpExceptionJSON } from '@neusers/lib/types'

/**
 * @file Global Test Fixture - BadRequestException
 * @module tests/fixtures/BadRequestException
 */

export const BAD_REQUEST = new BadRequestException()
export const BAD_REQUEST_JSON = BAD_REQUEST.getResponse() as HttpExceptionJSON
