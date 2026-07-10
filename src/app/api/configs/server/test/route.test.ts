import type { NextRequest } from 'next/server'
import { describe, expect, it, vi } from 'vitest'

vi.mock('@/configs/server', () => ({
  serverConfig: {
    jwtSecret: 'server-secret',
  },
}))

import { GET } from '../route'

describe('GET /api/configs/server', () => {
  it('returns the server config', async () => {
    const response = await GET(undefined as unknown as NextRequest)

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({
      jwtSecret: 'server-secret',
    })
  })
})
