declare namespace jest {
  type ToBeArrayOptions = {
    length?: number
  }

  type ToBeJSONResponseOptions = {
    array?: jest.ToBeArrayOptions | boolean
    obj?: jest.ToBePlainObjectOptions | boolean
    status?: number
  }

  type ToBePlainObjectOptions = {
    keys?: string
    keys_length?: number
  }

  interface Matchers<R> {
    toBeArray(options?: ToBeArrayOptions): R
    toBeJSONResponse(options?: ToBeJSONResponseOptions): R
    toBePlainObject(options?: ToBePlainObjectOptions): R
    toEachHaveKeys(expected: string): R
    toEachHaveKeysLength(expected: number): R
    toHaveContentType(expected?: RegExp | string): R
    toHaveKeys(expected: string): R
    toHaveKeysLength(expected: number): R
    toHaveStatus(expected: number): R
  }
}
