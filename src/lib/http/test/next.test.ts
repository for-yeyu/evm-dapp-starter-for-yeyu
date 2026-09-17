import type { NextRequest } from 'next/server'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { TimeoutError } from '../../common/errors/request'
import { withResponse } from '../next'

const request = undefined as unknown as NextRequest

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => undefined)
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('withResponse', () => {
  it('returns a successful JSON response', async () => {
    const handler = withResponse(() => ({ ok: true }))
    const response = await handler(request)

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ ok: true })
    expect(console.error).not.toHaveBeenCalled()
  })

  it('returns only explicitly public data for expected business failures', async () => {
    const error = new TimeoutError('Invalid request', {
      data: { apiSecret: 'private-value' },
      publicData: { field: 'name' },
      cause: new Error('Database credentials: private-value'),
      needFix: false,
    })
    const handler = withResponse(() => {
      throw error
    })
    const response = await handler(request)

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({
      name: 'TimeoutError',
      message: 'Invalid request',
      data: { field: 'name' },
    })
    expect(console.error).not.toHaveBeenCalled()
  })

  it('does not expose diagnostic data when public data is not specified', async () => {
    const handler = withResponse(() => {
      throw new TimeoutError('Invalid request', {
        data: { apiSecret: 'private-value' },
        needFix: false,
      })
    })
    const response = await handler(request)

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({
      name: 'TimeoutError',
      message: 'Invalid request',
      data: null,
    })
  })

  it('redacts BaseError failures that need fixing and logs the original error', async () => {
    const error = new TimeoutError('Database credentials: private-value', {
      data: { apiSecret: 'private-value' },
      publicData: { field: 'name' },
    })
    const handler = withResponse(() => {
      throw error
    })
    const response = await handler(request)

    expect(response.status).toBe(500)
    await expect(response.json()).resolves.toEqual({
      name: 'InternalServerError',
      message: 'Internal Server Error',
      data: null,
    })
    expect(console.error).toHaveBeenCalledExactlyOnceWith(error)
  })

  it('redacts regular errors and logs the original error', async () => {
    const error = new Error('Database credentials: private-value')
    const handler = withResponse(() => {
      throw error
    })
    const response = await handler(request)

    expect(response.status).toBe(500)
    await expect(response.json()).resolves.toEqual({
      name: 'InternalServerError',
      message: 'Internal Server Error',
      data: null,
    })
    expect(console.error).toHaveBeenCalledExactlyOnceWith(error)
  })

  it('redacts unknown thrown values and logs the original value', async () => {
    const error = { apiSecret: 'private-value' }
    const handler = withResponse(() => {
      throw error
    })
    const response = await handler(request)

    expect(response.status).toBe(500)
    await expect(response.json()).resolves.toEqual({
      name: 'InternalServerError',
      message: 'Internal Server Error',
      data: null,
    })
    expect(console.error).toHaveBeenCalledExactlyOnceWith(error)
  })

  it('redacts asynchronous handler failures', async () => {
    const error = new Error('Database credentials: private-value')
    const handler = withResponse(async () => {
      throw error
    })
    const response = await handler(request)

    expect(response.status).toBe(500)
    await expect(response.json()).resolves.toEqual({
      name: 'InternalServerError',
      message: 'Internal Server Error',
      data: null,
    })
    expect(console.error).toHaveBeenCalledExactlyOnceWith(error)
  })
})
