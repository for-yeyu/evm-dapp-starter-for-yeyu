import { afterEach, describe, expect, it, vi } from 'vitest'

afterEach(() => {
  vi.resetModules()
  vi.unstubAllEnvs()
})

describe('environmentConfig', () => {
  it('exposes the configured environment', async () => {
    vi.stubEnv('NEXT_PUBLIC_ENVIRONMENT', 'development')

    const { environmentConfig } = await import('../environment')

    expect(environmentConfig).toEqual({
      environment: 'development',
    })
  })
})
