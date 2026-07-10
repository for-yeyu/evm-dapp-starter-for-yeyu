import { afterEach, describe, expect, it, vi } from 'vitest'

afterEach(() => {
  vi.resetModules()
  vi.unstubAllEnvs()
})

describe('walletConfig', () => {
  it('exposes the wallet connect project id', async () => {
    vi.stubEnv('NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID', '83333dd2a970d5644e1318f9370b15a1')

    const { walletConfig } = await import('../wallet')

    expect(walletConfig).toEqual({
      walletConnectProjectId: '83333dd2a970d5644e1318f9370b15a1',
    })
  })
})
