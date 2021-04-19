import { NestFactory } from '@nestjs/core'
import AppModule from './app.module'
import { CONFIGURATION } from './config/configuration'
import useGlobal from './useGlobal'

/**
 * @file NestJS App Entry Point
 * @module app/main
 */

/**
 * Creates a new NestJS application.
 *
 * - https://docs.nestjs.com/openapi/introduction
 *
 * @async
 * @return {Promise<void>} Empty promise when complete
 */
async function bootstrap(): Promise<void> {
  // Create NestJS application
  const app = await NestFactory.create(AppModule)

  // Initialize globals
  await useGlobal(app)

  // Start application server
  await app.listen(CONFIGURATION.PORT)
}

// Initialize application
bootstrap()
