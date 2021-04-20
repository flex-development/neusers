/**
 * @file Global Interface - EnvironmentVariables
 * @module app/lib/interfaces/EnvironmentVariables
 */

/**
 * Shape of object containing environment variables used in this application.
 */
export interface EnvironmentVariables {
  readonly GA_ENABLED: boolean
  readonly GA_TRACKING_ID: string
  readonly DEV: boolean
  readonly NODE_ENV: string
  readonly PORT: number
  readonly PREVIEW: boolean
  readonly PROD: boolean
  readonly TEST: boolean
  readonly TITLE: string
  readonly URL: string
  readonly VERCEL: number
  readonly VERCEL_ENV: string
  readonly VERCEL_GIT_COMMIT_REF: string
  readonly VERCEL_GIT_COMMIT_SHA: string
}
