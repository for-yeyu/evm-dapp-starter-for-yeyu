import { afterEach, describe, expect, it, vi } from 'vitest'
import { ApiRequestError, HttpRequestError, TimeoutError } from '../../common/errors/request'
import { apiRequest } from '../ky'

const { kyMock, MockHTTPError, MockTimeoutError } = vi.hoisted(() => {
  class MockHTTPError extends Error {
    response: Response

    constructor(response: Response) {
      super('HTTP error')
      this.response = response
    }
  }

  class MockTimeoutError extends Error {}

  return {
    kyMock: vi.fn(),
    MockHTTPError,
    MockTimeoutError,
  }
})

vi.mock('ky', () => ({
  default: kyMock,
  HTTPError: MockHTTPError,
  TimeoutError: MockTimeoutError,
}))

afterEach(() => {
  vi.clearAllMocks()
})

describe('apiRequest', () => {
  it('uses an empty URL when no URL is provided', async () => {
    const json = vi.fn().mockResolvedValue({ ok: true })
    kyMock.mockResolvedValue({ json })

    await expect(apiRequest({})).resolves.toEqual({ ok: true })
    expect(kyMock).toHaveBeenCalledWith(
      '',
      expect.objectContaining({
        prefix: '/api',
      }),
    )
  })

  it('returns the decoded response and applies the API prefix', async () => {
    const result = { ok: true }
    const json = vi.fn().mockResolvedValue(result)
    kyMock.mockResolvedValue({ json })

    await expect(apiRequest({ url: 'time' })).resolves.toEqual(result)
    expect(kyMock).toHaveBeenCalledWith(
      'time',
      expect.objectContaining({
        prefix: '/api',
        retry: 0,
        timeout: 30_000,
      }),
    )
    expect(json).toHaveBeenCalledOnce()
  })

  it('converts timeout errors to TimeoutError', async () => {
    const error = new MockTimeoutError('timeout')
    kyMock.mockRejectedValue(error)
    const request = apiRequest({ url: 'time' })

    await expect(request).rejects.toMatchObject({
      name: 'TimeoutError',
      cause: error,
    })
    await expect(request).rejects.toBeInstanceOf(TimeoutError)
  })

  it('converts API error responses to ApiRequestError', async () => {
    const payload = {
      name: 'ValidationError',
      message: 'Invalid request',
      data: { field: 'name' },
    }
    const error = new MockHTTPError(
      new Response(JSON.stringify(payload), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      }),
    )
    kyMock.mockRejectedValue(error)
    const request = apiRequest({ url: 'time' })

    await expect(request).rejects.toMatchObject({
      name: 'ApiRequestError',
      message: 'Invalid request',
      status: 400,
      responseErrorName: 'ValidationError',
      responseErrorData: { field: 'name' },
      cause: expect.any(HttpRequestError),
    })
    await expect(request).rejects.toBeInstanceOf(ApiRequestError)
  })

  it('keeps HTTP errors when the response is not JSON', async () => {
    const error = new MockHTTPError(new Response('invalid response', { status: 500 }))
    kyMock.mockRejectedValue(error)

    await expect(apiRequest({ url: 'time' })).rejects.toMatchObject({
      name: 'HttpRequestError',
      status: 500,
      json: undefined,
      cause: error,
    })
  })

  it('keeps unknown rejection values unchanged', async () => {
    const error = 'unknown request failure'
    kyMock.mockRejectedValue(error)

    await expect(apiRequest({ url: 'time' })).rejects.toBe(error)
  })

  it('converts response decoding errors to HttpRequestError', async () => {
    const error = new Error('invalid response')
    kyMock.mockResolvedValue({
      json: vi.fn().mockRejectedValue(error),
    })

    await expect(apiRequest({ url: 'time' })).rejects.toMatchObject({
      name: 'HttpRequestError',
      status: null,
      cause: error,
    })
  })
})
