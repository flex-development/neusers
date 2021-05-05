import Exception from '@flex-development/exceptions/exceptions/base.exception'
import type {
  CallHandler,
  ExecutionContext,
  NestInterceptor
} from '@nestjs/common'
import { Injectable } from '@nestjs/common'
import type { Request } from 'express'
import type { Observable } from 'rxjs'
import type { InterceptorResponse as Response } from '../../../lib/types'
import AuthService from '../providers/auth.service'

/**
 * @file Subdomain Interceptor - AuthInterceptor
 * @module app/subdomains/users/interceptors/AuthInterceptor
 */

@Injectable()
export default class AuthInterceptor<T>
  implements NestInterceptor<T, Response<T>> {
  constructor(readonly auth: AuthService) {}

  /**
   * Determines if a user is authorized.
   *
   * A `401 UNAUTHORIZED` error will be thrown if login fails.
   *
   * @template T - Payload type
   *
   * @async
   * @param {ExecutionContext} context - Object providing methods to access the
   * route handler and class about to be invoked
   * @param {CallHandler} next - Provides access to an `Observable` representing
   * the response stream from the route handler
   * @return {Promise<Observable<Response<T>>>} Promise containg handler res
   * @throws {Exception}
   */
  async intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Promise<Observable<Response<T>>> {
    // Get request object
    const req = context.switchToHttp().getRequest<Request>()

    // Get request headers and method
    const { headers, method } = req

    // Decode Basic Authorization header
    const { email, password } = this.auth.decodeBasicAuth(headers.authorization)

    try {
      // Attempt to login in users
      await this.auth.login(email, password)
    } catch (error) {
      const exception = error as Exception

      // Add boolean indiciating that user is unauthorized
      req.params.authorized = 'false'

      // Allow `GET` requests to success even if unauthorized
      if (method.toUpperCase() === 'GET') return next.handle()

      throw exception
    }

    // Add boolean indiciating that user is authorized
    req.params.authorized = 'true'

    return next.handle()
  }
}
