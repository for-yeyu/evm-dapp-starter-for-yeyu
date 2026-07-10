import { afterEach, describe, expect, it, vi } from 'vitest'
import { apiRequest } from '@/lib/http/ky'
import { getServerConfig } from '../get-server-configs'

vi.mock('@/lib/http/ky', () => ({
  apiRequest: vi.fn(),
}))

afterEach(() => {
  vi.clearAllMocks()
})

describe('getServerConfig', () => {
  it('requests the server config endpoint', async () => {
    const result = { jwtSecret: 'server-secret' }
    vi.mocked(apiRequest).mockResolvedValue(result)

    await expect(getServerConfig()).resolves.toEqual(result)
    expect(apiRequest).toHaveBeenCalledWith({ url: 'configs/server' })
  })

  it('propagates request errors', async () => {
    const error = new Error('request failed')
    vi.mocked(apiRequest).mockRejectedValue(error)

    await expect(getServerConfig()).rejects.toBe(error)
  })
})
