import Exception from '@flex-development/exceptions/exceptions/base.exception'
import type { ExceptionJSON } from '@flex-development/exceptions/interfaces'
import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common'
import { Catch, HttpException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { Request, Response } from 'express'
import type { EventParam } from 'ga-measurement-protocol'
import merge from 'lodash.merge'
import type { PlainObject } from 'simplytyped'
import MeasurementProtocol from '../../config/measurement-protocol'

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
   * Handles an `Exception` or `HttpException`.
   *
   * The exception will be timestamped, and in `development` environments, the
   * exception stack will be available.
   *
   * @todo Log error before sending error `event` hit
   *
   * @param {Exception | HttpException} e - Exception to handle
   * @param {ArgumentsHost} host - Args for in-flight request
   * @return {Promise<void>} Empty promise when complete
   */
  async catch(
    e: Exception | HttpException,
    host: ArgumentsHost
  ): Promise<void> {
    // Get HTTP request and response objects
    const ctx = host.switchToHttp()
    const req = ctx.getRequest<Request>()
    const res = ctx.getResponse<Response>()

    // Get function to get exception as JSON
    const jsonFN = e.constructor.name === 'Exception' ? 'toJSON' : 'getResponse'

    // Get exception response
    let ejson = e[jsonFN]() as PlainObject

    // Convert into `ExceptionJSON` if necessary
    if (!ejson.className) {
      const { message, statusCode } = ejson

      ejson = new Exception(statusCode, message, {}, e.stack).toJSON()
      ejson.data.stack = e.stack
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
    await this.track(ejson as ExceptionJSON, {
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
   * @param {ExceptionJSON} error - Error to report
   * @param {Partial<EventParam>} [param] - Additional event parameters
   * @return {Promise<boolean>} Promise containing `true` if event was tracked
   * successfully, `false` otherwise
   */
  async track(
    error: ExceptionJSON,
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
