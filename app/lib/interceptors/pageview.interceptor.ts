import type {
  CallHandler,
  ExecutionContext,
  NestInterceptor
} from '@nestjs/common'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Request } from 'express'
import { Observable } from 'rxjs'
import MeasurementProtocol from '../../config/measurement-protocol'
import type { EnvironmentVariables } from '../interfaces'
import type { InterceptorResponse as Response } from '../types'

/**
 * @file Interceptors - PageviewInterceptor
 * @module app/lib/interceptors/Pageview
 */

@Injectable()
export default class PageviewInterceptor implements NestInterceptor {
  private readonly GAMP: typeof MeasurementProtocol = MeasurementProtocol

  constructor(readonly config: ConfigService<EnvironmentVariables>) {}

  /**
   * Sends a `pageview` hit to Google Analytics.
   *
   * @template T - Payload type
   *
   * @param {ExecutionContext} context - Object providing methods to access the
   * route handler and class about to be invoked
   * @param {CallHandler} next - Provides access to an `Observable`
   * representing the response stream from the route handler
   * @return {Promise<Observable<Response>>} Promise containg handler res
   */
  async intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Promise<Observable<Response>> {
    const { headers, path, url } = context.switchToHttp().getRequest<Request>()

    // Send hit to Google Analytics
    await this.GAMP.pageview({
      dl: url,
      documentHost: headers.host || 'unknown',
      documentPath: path,
      ds: 'api',
      ip: headers['x-forwarded-for'] as string,
      ua: headers['user-agent'] as string,
      'vercel-branch': this.config.get<string>('VERCEL_GIT_COMMIT_REF') || '',
      'vercel-commit': this.config.get<string>('VERCEL_GIT_COMMIT_SHA') || '',
      'vercel-env': this.config.get<string>('VERCEL_ENV') || ''
    })

    return next.handle()
  }
}
