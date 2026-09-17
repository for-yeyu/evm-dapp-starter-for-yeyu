import type { Options } from 'ky'
import ky, { HTTPError, TimeoutError as KyTimeoutError } from 'ky'
import { ApiRequestError, HttpRequestError, TimeoutError } from '../common/errors/request'

export type HttpRequestParams = Options & {
  url?: string
}

/**
 * Public template transport for external APIs, even before a feature consumes it.
 * @public
 */
// react-doctor-disable-next-line deslop/unused-export, react-doctor/unused-export -- template api
export async function httpRequest<T = unknown>(params: HttpRequestParams): Promise<T> {
  try {
    const { url, ...rest } = params
    const response = await ky(url ?? '', { retry: 0, timeout: 30_000, ...rest })
    return await response.json()
  } catch (error) {
    if (error instanceof KyTimeoutError) {
      throw new TimeoutError(undefined, { cause: error })
    }
    if (error instanceof Error) {
      const status = error instanceof HTTPError ? error.response.status : undefined
      const json = error instanceof HTTPError ? error.data : undefined
      throw new HttpRequestError(undefined, { data: { status, json }, cause: error })
    }
    throw error
  }
}

export async function apiRequest<T = unknown>(params: HttpRequestParams): Promise<T> {
  try {
    return await httpRequest<T>({ prefix: '/api', ...params })
  } catch (error) {
    if (error instanceof HttpRequestError) {
      const json = error.json
      if (
        error.status != null &&
        typeof json === 'object' &&
        json !== null &&
        'name' in json &&
        typeof json.name === 'string' &&
        'message' in json &&
        typeof json.message === 'string' &&
        'data' in json
      ) {
        throw new ApiRequestError(json.message, {
          data: {
            status: error.status,
            responseErrorName: json.name,
            responseErrorData: json.data,
          },
          cause: error,
        })
      }
    }
    throw error
  }
}
