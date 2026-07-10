import type { NextRequest } from 'next/server'
import { describe, expect, it } from 'vitest'
import { TimeoutError } from '../../common/errors/request'
import { withResponse } from '../next'

const request = undefined as unknown as NextRequest

describe('withResponse', () => {
  it('returns a successful JSON response', async () => {
    const handler = withResponse(() => ({ ok: true }))
    const response = await handler(request)

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ ok: true })
  })

  it('returns a 400 response for fixable BaseError failures', async () => {
    const error = new TimeoutError('Invalid request', {
      data: { field: 'name' },
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
  })

  it('returns a 500 response for BaseError failures that need fixing', async () => {
    const handler = withResponse(() => {
      throw new TimeoutError('Server failure')
    })
    const response = await handler(request)

    expect(response.status).toBe(500)
    await expect(response.json()).resolves.toEqual({
      name: 'TimeoutError',
      message: 'Server failure',
      data: undefined,
    })
  })

  it('returns an internal server response for regular errors', async () => {
    const handler = withResponse(() => {
      throw new Error('Unexpected failure')
    })
    const response = await handler(request)

    expect(response.status).toBe(500)
    await expect(response.json()).resolves.toEqual({
      name: 'InternalServerError',
      message: 'Unexpected failure',
      data: null,
    })
  })

  it('returns a default internal server response for unknown values', async () => {
    const handler = withResponse(() => {
      throw 'unknown failure'
    })
    const response = await handler(request)

    expect(response.status).toBe(500)
    await expect(response.json()).resolves.toEqual({
      name: 'InternalServerError',
      message: 'Internal Server Error',
      data: null,
    })
  })
})
