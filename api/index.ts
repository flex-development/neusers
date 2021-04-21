import type { NestApplicationOptions } from '@nestjs/common'
import type {
  BootstrapOptions,
  UseGlobal
} from 'create-vercel-http-server-handler'
import { createVercelHandler } from 'create-vercel-http-server-handler'
import AppModule from '../app/app.module'
import useGlobal from '../app/useGlobal'

/**
 * @file Vercel Serverless API Handler
 * @module api
 * @see https://github.com/jlarmstrongiv/create-vercel-http-server-handler
 */

const nestApplicationOptions: NestApplicationOptions = {
  cors: true,
  logger: console
}

const bootstrapOptions: BootstrapOptions = {
  AppModule,
  nestApplicationOptions,
  useGlobal: (useGlobal as unknown) as UseGlobal
}

export default createVercelHandler(bootstrapOptions)

export const config = { api: { bodyParser: false } }
