import { HTTPError, TimeoutError as KyTimeoutError } from 'ky'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiRequestError, HttpRequestError, TimeoutError } from '../../common/errors/request'
import { apiRequest, httpRequest } from '../ky'

const fetchMock = vi.fn<typeof fetch>()
const externalRequestParams = { url: 'https://service.example.test/profile', fetch: fetchMock }
const apiRequestParams = {
  url: 'profile',
  baseUrl: 'https://app.example.test',
  fetch: fetchMock,
}

beforeEach(() => {
  fetchMock.mockReset()
})

describe('httpRequest', () => {
  it('returns the decoded response from an external API without adding a prefix', async () => {
    fetchMock.mockResolvedValue(Response.json({ displayName: 'Example user' }))

    await expect(httpRequest(externalRequestParams)).resolves.toEqual({
      displayName: 'Example user',
    })
    expect(fetchMock).toHaveBeenCalledOnce()
    expect(fetchMock.mock.calls[0][0]).toMatchObject({
      url: 'https://service.example.test/profile',
      method: 'GET',
    })
  })

  it('preserves pre-parsed error data after ky consumes the response body', async () => {
    const payload = { detail: 'Service unavailable' }
    const response = Response.json(payload, { status: 503 })
    fetchMock.mockResolvedValue(response)
    const request = httpRequest(externalRequestParams)

    await expect(request).rejects.toMatchObject({
      name: 'HttpRequestError',
      status: 503,
      json: payload,
      cause: expect.any(HTTPError),
    })
    expect(response.bodyUsed).toBe(true)
    expect(fetchMock).toHaveBeenCalledOnce()
  })

  it('converts ky timeout errors to TimeoutError', async () => {
    const error = new KyTimeoutError(new Request(externalRequestParams.url))
    fetchMock.mockRejectedValue(error)
    const request = httpRequest(externalRequestParams)

    await expect(request).rejects.toMatchObject({ name: 'TimeoutError', cause: error })
    await expect(request).rejects.toBeInstanceOf(TimeoutError)
  })

  it('passes request method and JSON payload through to the transport', async () => {
    let requestBody: unknown
    fetchMock.mockImplementation(async input => {
      requestBody = await (input as Request).json()
      return Response.json({ ok: true })
    })

    await httpRequest({
      ...externalRequestParams,
      method: 'POST',
      json: { displayName: 'Updated' },
    })

    const request = fetchMock.mock.calls[0][0] as Request
    expect(request.method).toBe('POST')
    expect(requestBody).toEqual({ displayName: 'Updated' })
  })
})

describe('apiRequest', () => {
  it('requests the API root when no URL is provided', async () => {
    fetchMock.mockResolvedValue(Response.json({ ok: true }))

    await expect(apiRequest({ ...apiRequestParams, url: undefined })).resolves.toEqual({ ok: true })
    expect(fetchMock.mock.calls[0][0]).toMatchObject({ url: 'https://app.example.test/api/' })
  })

  it('returns the decoded response and applies the API prefix', async () => {
    fetchMock.mockResolvedValue(Response.json({ ok: true }))

    await expect(apiRequest(apiRequestParams)).resolves.toEqual({ ok: true })
    expect(fetchMock.mock.calls[0][0]).toMatchObject({
      url: 'https://app.example.test/api/profile',
    })
  })

  it('converts API error responses to ApiRequestError with real ky', async () => {
    const payload = {
      name: 'ValidationError',
      message: 'Invalid request',
      data: { field: 'name' },
    }
    fetchMock.mockResolvedValue(Response.json(payload, { status: 400 }))
    const request = apiRequest(apiRequestParams)

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

  it('preserves converted timeout errors at the API boundary', async () => {
    const error = new KyTimeoutError(new Request('https://app.example.test/api/profile'))
    fetchMock.mockRejectedValue(error)

    await expect(apiRequest(apiRequestParams)).rejects.toMatchObject({
      name: 'TimeoutError',
      cause: error,
    })
  })

  it('preserves non-JSON HTTP error bodies without treating them as API errors', async () => {
    fetchMock.mockResolvedValue(new Response('Service unavailable', { status: 500 }))

    await expect(apiRequest(apiRequestParams)).rejects.toMatchObject({
      name: 'HttpRequestError',
      status: 500,
      json: 'Service unavailable',
      cause: expect.any(HTTPError),
    })
  })

  it.each([
    null,
    [],
    'Unexpected response',
    { message: 'Missing name' },
    { name: 'InvalidError', message: 123, data: null },
    { name: 'InvalidError', message: 'Missing data' },
  ])('preserves HTTP errors for invalid API error payloads: %j', async payload => {
    fetchMock.mockResolvedValue(Response.json(payload, { status: 500 }))

    await expect(apiRequest(apiRequestParams)).rejects.toMatchObject({
      name: 'HttpRequestError',
      status: 500,
      json: payload,
    })
  })

  it('keeps HTTP status when ky cannot decode an error body', async () => {
    fetchMock.mockResolvedValue(
      new Response('{invalid', { status: 502, headers: { 'content-type': 'application/json' } }),
    )

    await expect(apiRequest(apiRequestParams)).rejects.toMatchObject({
      name: 'HttpRequestError',
      status: 502,
      json: undefined,
    })
  })

  it('does not retry failed API requests', async () => {
    fetchMock.mockResolvedValue(Response.json({ error: 'Service unavailable' }, { status: 503 }))

    await expect(apiRequest(apiRequestParams)).rejects.toBeInstanceOf(HttpRequestError)
    expect(fetchMock).toHaveBeenCalledOnce()
  })

  it('keeps unknown rejection values unchanged', async () => {
    fetchMock.mockRejectedValue('unknown request failure')

    await expect(apiRequest(apiRequestParams)).rejects.toBe('unknown request failure')
  })

  it('converts successful response decoding errors to HttpRequestError', async () => {
    fetchMock.mockResolvedValue(
      new Response('{invalid', { headers: { 'content-type': 'application/json' } }),
    )

    await expect(apiRequest(apiRequestParams)).rejects.toMatchObject({
      name: 'HttpRequestError',
      status: null,
      cause: expect.any(SyntaxError),
    })
  })
})
