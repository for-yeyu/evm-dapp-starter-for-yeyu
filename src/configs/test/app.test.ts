import { afterEach, describe, expect, it, vi } from 'vitest'

afterEach(() => {
  vi.resetModules()
  vi.unstubAllEnvs()
})

describe('appConfig', () => {
  it('exposes the public application configuration', async () => {
    vi.stubEnv('NEXT_PUBLIC_APP_NAME', 'Test application')
    vi.stubEnv('NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID', '83333dd2a970d5644e1318f9370b15a1')

    const { appConfig } = await import('../app')

    expect(appConfig).toEqual({
      appName: 'Test application',
      walletConnectProjectId: '83333dd2a970d5644e1318f9370b15a1',
    })
  })
})
