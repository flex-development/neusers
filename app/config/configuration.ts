/**
 * @file NestJS App Configuration
 * @module app/config/configuration
 * @see https://docs.nestjs.com/techniques/configuration
 */

const {
  NODE_ENV = 'development',
  PORT = '8080',
  TITLE = 'Neusers',
  VERCEL = '0',
  VERCEL_ENV = 'development.local',
  VERCEL_GIT_COMMIT_REF = '',
  VERCEL_GIT_COMMIT_SHA = '',
  VERCEL_URL: URL = `http://localhost:${PORT}`
} = process.env

/**
 * Shape of object containing environment variables used in this application.
 */
export interface EnvironmentVariables {
  readonly NODE_ENV: string
  readonly PORT: number
  readonly TITLE: string
  readonly URL: string
  readonly VERCEL: number
  readonly VERCEL_ENV: string
  readonly VERCEL_GIT_COMMIT_REF: string
  readonly VERCEL_GIT_COMMIT_SHA: string
}

/**
 * @property {EnvironmentVariables} CONFIGURATION - Enivronment variables
 */
export const CONFIGURATION: EnvironmentVariables = {
  NODE_ENV: NODE_ENV.toLowerCase(),
  PORT: JSON.parse(PORT),
  TITLE,
  URL: URL.startsWith('http://') ? URL : `https://${URL}`,
  VERCEL: JSON.parse(VERCEL),
  VERCEL_ENV: VERCEL_ENV.toLowerCase(),
  VERCEL_GIT_COMMIT_REF,
  VERCEL_GIT_COMMIT_SHA
}

/**
 * Returns an object containing the application's environment variables.
 *
 * @return {EnvironmentVariables} Environment variables
 */
export default (): EnvironmentVariables => CONFIGURATION
