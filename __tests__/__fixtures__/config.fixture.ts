import { CONF } from '@/config/configuration'
import { ConfigService } from '@nestjs/config'

/**
 * @file Global Test Fixture - Config
 * @module tests/fixtures/Config
 */

export default new ConfigService(CONF)
