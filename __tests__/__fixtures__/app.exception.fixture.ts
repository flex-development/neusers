import AppException from '@/lib/exceptions/app.exception'
import type { ExceptionJSON } from '@flex-development/exceptions/interfaces'

/**
 * @file Global Test Fixture - AppException
 * @module tests/fixtures/AppException
 */

export const APP_EXCEPTION = new AppException()
export const APP_EXCEPTION_JSON = APP_EXCEPTION.getResponse() as ExceptionJSON
