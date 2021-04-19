/**
 * @file Enums - ExceptionClassName
 * @module app/lib/enums/exception-class-name
 */

export enum ExceptionClassName {
  BAD_REQUEST = 'bad-request',
  UNAUTHORIZED = 'not-authenticated',
  PAYMENT_REQUIRED = 'payment-error',
  FORBIDDEN = 'forbidden',
  NOT_FOUND = 'not-found',
  METHOD_NOT_ALLOWED = 'method-not-allowed',
  NOT_ACCEPTABLE = 'not-acceptable',
  PROXY_AUTHENTICATION_REQUIRED = 'proxy-auth-required',
  REQUEST_TIMEOUT = 'timeout',
  CONFLICT = 'conflict',
  GONE = 'gone',
  LENGTH_REQUIRED = 'length-required',
  PRECONDITION_FAILED = 'precondition-failed',
  PAYLOAD_TOO_LARGE = 'payload-too-large',
  URI_TOO_LONG = 'uri-too-long',
  UNSUPPORTED_MEDIA_TYPE = 'unsupported-media-type',
  REQUESTED_RANGE_NOT_SATISFIABLE = 'range-not-satisfiable',
  EXPECTATION_FAILED = 'expectation-failed',
  I_AM_A_TEAPOT = 'teapot',
  MISDIRECTED = 'misdirected',
  UNPROCESSABLE_ENTITY = 'unprocessable-entity',
  FAILED_DEPENDENCY = 'failed-dependency',
  TOO_MANY_REQUESTS = 'too-many-requests',
  INTERNAL_SERVER_ERROR = 'internal-server-error',
  NOT_IMPLEMENTED = 'not-implemeneted',
  BAD_GATEWAY = 'bad-gateway',
  SERVICE_UNAVAILABLE = 'unavailable'
}
