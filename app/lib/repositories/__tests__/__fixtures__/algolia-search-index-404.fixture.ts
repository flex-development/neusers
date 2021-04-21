import { createApiError } from '@algolia/transporter'

/**
 * @file Test Fixture - Algolia Missing Search Index Error
 * @module app/lib/repositories/tests/fixtures/algolia-search-index-404.fixture
 */

export default createApiError('Index foo does not exist', 404, [])
