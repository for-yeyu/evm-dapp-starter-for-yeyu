import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('server-only', () => ({}))

afterEach(() => {
  vi.resetModules()
  vi.unstubAllEnvs()
})

describe('serverConfig', () => {
  it('exposes the server secret', async () => {
    vi.stubEnv('JwtSecret', 'server-secret')

    const { serverConfig } = await import('../server')

    expect(serverConfig).toEqual({
      jwtSecret: 'server-secret',
    })
  })
})
