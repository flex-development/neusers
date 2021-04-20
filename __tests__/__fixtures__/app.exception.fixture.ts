import AppException from '@neusers/lib/exceptions/app.exception'
import type { AppExceptionJSON as IException } from '@neusers/lib/interfaces'

/**
 * @file Global Test Fixture - AppException
 * @module tests/fixtures/AppException
 */

export const APP_EXCEPTION = new AppException()

export const APP_EXCEPTION_JSON = APP_EXCEPTION.getResponse() as IException
