import { afterEach, describe, expect, it, vi } from 'vitest'
import { apiRequest } from '@/lib/http/ky'
import { getServerTime } from '../get-server-time'

vi.mock('@/lib/http/ky', () => ({
  apiRequest: vi.fn(),
}))

afterEach(() => {
  vi.clearAllMocks()
})

describe('getServerTime', () => {
  it('requests the server time endpoint', async () => {
    const result = 1_700_000_000
    vi.mocked(apiRequest).mockResolvedValue(result)

    await expect(getServerTime()).resolves.toEqual(result)
    expect(apiRequest).toHaveBeenCalledWith({ url: 'time' })
  })

  it('propagates request errors', async () => {
    const error = new Error('request failed')
    vi.mocked(apiRequest).mockRejectedValue(error)

    await expect(getServerTime()).rejects.toBe(error)
  })
})
