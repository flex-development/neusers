import Exception from '@flex-development/exceptions/exceptions/base.exception'
import type {
  CallHandler,
  ExecutionContext,
  NestInterceptor
} from '@nestjs/common'
import { Injectable } from '@nestjs/common'
import type { Request } from 'express'
import type { Observable } from 'rxjs'
import AuthService from '../providers/auth.service'
import type { AuthInterceptorResponse } from '../users.types'

/**
 * @file Users Subdomain Interceptor - AuthInterceptor
 * @module app/subdomains/users/interceptors/AuthInterceptor
 */

/**
 * User authentication interceptor.
 *
 * Write operations, such as `DELETE` or `PUT` required users to be logged in.
 * Requests for individual user resouces will **NOT** include any sensitive data
 * if the user is not logged in.
 *
 * @template T - Payload type
 *
 * References:
 *
 * - [Interceptors](https://docs.nestjs.com/interceptors)
 */
@Injectable()
export default class AuthInterceptor<
  T extends AuthInterceptorResponse = AuthInterceptorResponse
> implements NestInterceptor<T, T> {
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
   * @param {CallHandler<T>} next - Provides access to an `Observable`
   * representing the response stream from the route handler
   * @return {Promise<Observable<T>>} Promise containg handler res
   * @throws {Exception}
   */
  async intercept(
    context: ExecutionContext,
    next: CallHandler<T>
  ): Promise<Observable<T>> {
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
