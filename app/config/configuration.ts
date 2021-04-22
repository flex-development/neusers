import type { PlainObject } from 'simplytyped'
import type { EnvironmentVariables } from '../lib/interfaces'

/**
 * @file Config - NestJS App Configuration
 * @module app/config/configuration
 * @see https://docs.nestjs.com/techniques/configuration
 */

const {
  ALGOLIA_API_KEY = '',
  ALGOLIA_APP_ID = '',
  FIREBASE_CLIENT_EMAIL = '',
  FIREBASE_PRIVATE_KEY = '',
  FIREBASE_PROJECT_ID = '',
  GA_ENABLED,
  GA_TRACKING_ID,
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
 * @property {EnvironmentVariables} CONF - Environment variables
 */
export const CONF: EnvironmentVariables = (() => {
  const ev: PlainObject = {
    ALGOLIA_API_KEY,
    ALGOLIA_APP_ID,
    FIREBASE_CLIENT_EMAIL,
    FIREBASE_PRIVATE_KEY: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    FIREBASE_PROJECT_ID,
    GA_ENABLED: JSON.parse(`${GA_ENABLED || false}`),
    GA_TRACKING_ID,
    NODE_ENV: NODE_ENV.toLowerCase(),
    PORT: JSON.parse(PORT),
    SUBDOMAINS: {
      users: { endpoint: 'users', repo: 'users' }
    },
    TITLE,
    URL: URL.startsWith('http://') ? URL : `https://${URL}`,
    VERCEL: JSON.parse(VERCEL),
    VERCEL_ENV: VERCEL_ENV.toLowerCase(),
    VERCEL_GIT_COMMIT_REF,
    VERCEL_GIT_COMMIT_SHA
  }

  ev.DEV = ev.NODE_ENV === 'development' || ev.VERCEL_ENV === 'development'
  ev.PREVIEW = ev.VERCEL_ENV === 'preview'
  ev.PROD = ev.NODE_ENV === 'production' || ev.VERCEL_ENV === 'production'
  ev.TEST = ev.NODE_ENV === 'test'

  return ev as EnvironmentVariables
})()

/**
 * Returns an object containing the application's environment variables.
 *
 * @return {EnvironmentVariables} Environment variables
 */
export default (): EnvironmentVariables => CONF
