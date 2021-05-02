import type { HttpExceptionJSON } from '@/lib/types'
import { BadRequestException } from '@nestjs/common/exceptions'

/**
 * @file Global Test Fixture - BadRequestException
 * @module tests/fixtures/BadRequestException
 */

export const BAD_REQUEST = new BadRequestException()
export const BAD_REQUEST_JSON = BAD_REQUEST.getResponse() as HttpExceptionJSON
