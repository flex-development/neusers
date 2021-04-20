import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common'
import { Catch, HttpException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { Request, Response } from 'express'
import type { EventParam } from 'ga-measurement-protocol'
import merge from 'lodash/merge'
import type { PlainObject } from 'simplytyped'
import MeasurementProtocol from '../../config/measurement-protocol'
import type { AppExceptionJSON } from '../../lib/interfaces'
import AppException from '../exceptions/app.exception'

/**
 * @file Filters - AllExceptionsFilter
 * @module app/lib/filters/all-exceptions
 */

@Catch()
export default class AllExceptionsFilter implements ExceptionFilter {
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
   * Handles an `AppException`.
   *
   * The exception will be timestamped, and in `development` environments, the
   * exception stack will be available.
   *
   * @todo Log error before sending error `event` hit
   *
   * @param {AppException | HttpException} exception - Exception being handled
   * @param {ArgumentsHost} host - Args for in-flight request
   * @return {Promise<void>} Empty promise when complete
   */
  async catch(
    exception: AppException | HttpException,
    host: ArgumentsHost
  ): Promise<void> {
    // Get HTTP request and response objects
    const ctx = host.switchToHttp()
    const req = ctx.getRequest<Request>()
    const res = ctx.getResponse<Response>()

    // Get exception response
    let ejson = exception.getResponse() as PlainObject

    // Convert into `AppExceptionJSON` if necessary
    if (!ejson.className) {
      ejson = AppException.createBody({}, ejson.message, ejson.statusCode)
      ejson.data.stack = exception.stack
    }

    // Attach additional error data
    ejson.data.path = req.path
    ejson.data.timestamp = new Date().toISOString()
    ejson.data.vercel = {
      branch: this.config.get<string>('VERCEL_GIT_COMMIT_REF') || '',
      commit: this.config.get<string>('VERCEL_GIT_COMMIT_SHA') || '',
      env: this.config.get<string>('VERCEL_ENV') || ''
    }

    // Send error `event` hit
    await this.track(ejson as AppExceptionJSON, {
      method: req.method.toUpperCase(),
      path: ejson.data.path,
      ua: req.headers['user-agent']
    })

    // Send error response to client
    res.status(ejson.code).json(ejson)
    return
  }

  /**
   * Sends an error `event` hit to Google Analytics.
   *
   * Responses will be tracked under the "Error Response" category, and labeled
   * with the error message.
   *
   * @param {AppExceptionJSON} error - Error to report
   * @param {Partial<EventParam>} [param] - Additional event parameters
   * @return {Promise<boolean>} Promise containing `true` if event was tracked
   * successfully, `false` otherwise
   */
  async track(
    error: AppExceptionJSON,
    param: Partial<EventParam> = {}
  ): Promise<boolean> {
    const { code: eventValue, message: eventLabel, name: eventAction } = error

    // Build base event param object
    const bparam: EventParam = {
      error: JSON.stringify(error),
      eventAction,
      eventCategory: 'Error Response',
      eventLabel,
      eventValue
    }

    return await MeasurementProtocol.event(merge(bparam, param))
  }
}
