import { describe, expect, it } from 'vitest'
import { ApiRequestError, HttpRequestError, TimeoutError } from '../request'

describe('TimeoutError', () => {
  it('uses the default message', () => {
    const error = new TimeoutError()

    expect(error.name).toBe('TimeoutError')
    expect(error.message).toBe('Request timeout.')
  })
})

describe('HttpRequestError', () => {
  it('uses the default message without a status', () => {
    const error = new HttpRequestError(undefined)

    expect(error.message).toBe('HTTP request failed.')
    expect(error.status).toBeNull()
    expect(error.json).toBeUndefined()
  })

  it('includes status and JSON response data', () => {
    const json = { message: 'Bad request' }
    const error = new HttpRequestError(undefined, {
      data: { status: 400, json },
    })

    expect(error.message).toBe('HTTP request failed with status 400.')
    expect(error.status).toBe(400)
    expect(error.json).toEqual(json)
  })
})

describe('ApiRequestError', () => {
  it('stores the API response error details', () => {
    const error = new ApiRequestError(undefined, {
      data: {
        status: 422,
        responseErrorName: 'ValidationError',
        responseErrorData: { field: 'name' },
      },
    })

    expect(error.message).toBe('API request failed.')
    expect(error.status).toBe(422)
    expect(error.responseErrorName).toBe('ValidationError')
    expect(error.responseErrorData).toEqual({ field: 'name' })
  })
})
