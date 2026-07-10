import { afterEach, describe, expect, it, vi } from 'vitest'

afterEach(() => {
  vi.resetModules()
  vi.unstubAllEnvs()
})

describe('appConfig', () => {
  it('exposes the public application name', async () => {
    vi.stubEnv('NEXT_PUBLIC_APP_NAME', 'Test application')

    const { appConfig } = await import('../app')

    expect(appConfig).toEqual({
      appName: 'Test application',
    })
  })
})
