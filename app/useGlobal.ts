import type { INestApplication } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { NestExpressApplication } from '@nestjs/platform-express'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as pkg from '../package.json'
import { CONF } from './config/configuration'
import { AllExceptionsFilter } from './lib/filters'
import { PageviewInterceptor } from './lib/interceptors'
import { EnvironmentVariables } from './lib/interfaces'

/**
 * @file Implementation - useGlobal
 * @module app/useGlobal
 * @see https://github.com/jlarmstrongiv/create-vercel-http-server-handler
 */

const { description, homepage, license, version } = pkg

export type App = INestApplication | NestExpressApplication

/**
 * Callback to add global filters, guards, interceptors, and pipes.
 *
 * - https://docs.nestjs.com/openapi/introduction
 *
 * @param {App} app - Application to initialize Swagger UI
 * @return {Promise<App>} Promise containing app with globals initialized
 */
const useGlobal = async (app: App): Promise<typeof app> => {
  // Instantiate new Config service
  const Config = new ConfigService<EnvironmentVariables>(CONF)

  // Add global filters and interceptors
  app.useGlobalFilters(new AllExceptionsFilter(Config))
  app.useGlobalInterceptors(new PageviewInterceptor(Config))

  // Initialize OpenAPI document builder
  const builder = new DocumentBuilder()

  // Set OpenAPI properties
  builder.setTitle('Neusers')
  builder.setDescription(description)
  builder.setVersion(version)
  builder.setLicense(license, `https://opensource.org/licenses/${license}`)
  builder.setContact('GitHub', homepage, (null as unknown) as string)
  builder.addServer(CONF.URL, CONF.VERCEL_ENV.toUpperCase())
  builder.addTag('users', 'CRUD operations')

  // Generate OpenAPI object
  const openapi = SwaggerModule.createDocument(app, builder.build())

  // Expose OpenAPI documntation as JSON
  app.getHttpAdapter().get('', (req, res) => res.json(openapi))

  return app
}

export default useGlobal
