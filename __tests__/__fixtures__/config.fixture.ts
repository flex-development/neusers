import { ConfigService } from '@nestjs/config'
import { CONF } from '@neusers/config/configuration'

/**
 * @file Global Test Fixture - Config
 * @module tests/fixtures/Config
 */

export default new ConfigService(CONF)
