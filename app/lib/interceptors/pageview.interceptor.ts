import type {
  CallHandler,
  ExecutionContext,
  NestInterceptor
} from '@nestjs/common'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Request } from 'express'
import { Observable } from 'rxjs'
import type { PlainObject } from 'simplytyped'
import MeasurementProtocol from '../../config/measurement-protocol'

/**
 * @file Interceptors - PageviewInterceptor
 * @module app/lib/interceptors/Pageview
 */

export type Response<T = PlainObject> = T | T[]

@Injectable()
export default class PageviewInterceptor<T>
  implements NestInterceptor<T, Response<T>> {
  private readonly GAMP: typeof MeasurementProtocol = MeasurementProtocol

  /**
   * Instantiates a new `AllExceptionsFilter`.
   *
   * @param {ConfigService} config - App configuration service
   */
  constructor(private readonly config: ConfigService) {
    this.config = config
  }

  /**
   * Sends a `pageview` hit to Google Analytics.
   *
   * @template T - Payload type
   *
   * @param {ExecutionContext} context - Object providing methods to access the
   * route handler and class about to be invoked
   * @param {CallHandler} next - Provides access to an `Observable` representing
   * the response stream from the route handler
   * @return {Promise<Observable<Response<T>>>} Promise containg handler res
   */
  async intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Promise<Observable<Response<T>>> {
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
