import type { NextRequest } from 'next/server'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { GET } from '../route'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('GET /api/time', () => {
  it('returns the current timestamp', async () => {
    vi.spyOn(Date, 'now').mockReturnValue(1_700_000_000_000)

    const response = await GET(undefined as unknown as NextRequest)

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toBe(1_700_000_000_000)
  })
})
