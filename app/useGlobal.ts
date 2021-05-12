import type { INestApplication } from '@nestjs/common'
import type { NestExpressApplication } from '@nestjs/platform-express'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import merge from 'lodash.merge'
import * as pkg from '../package.json'
import { CONF } from './config/configuration'
import { OPENAPI_GLOBALS as OPENAPI } from './lib'

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
  builder.addBasicAuth({
    description: 'User email and password',
    scheme: 'basic',
    type: 'http'
  })

  // Generate OpenAPI object
  const openapi = SwaggerModule.createDocument(app, builder.build(), {
    extraModels: []
  })

  // Merge additional schemas
  const schemas = merge({}, openapi.components?.schemas, OPENAPI.schemas)
  if (openapi.components) openapi.components.schemas = schemas

  // Expose OpenAPI documntation as JSON
  app.getHttpAdapter().get('', (req, res) => res.json(openapi))

  return app
}

export default useGlobal
