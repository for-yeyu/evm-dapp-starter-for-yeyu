import { afterEach, describe, expect, it, vi } from 'vitest'
import { validateWalletEnv } from '../wallet'

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('validateWalletEnv', () => {
  it('accepts a valid wallet connect project id', () => {
    vi.stubEnv('NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID', '83333dd2a970d5644e1318f9370b15a1')

    expect(() => validateWalletEnv()).not.toThrow()
  })

  it('rejects an invalid wallet connect project id', () => {
    vi.stubEnv('NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID', 'invalid')

    expect(() => validateWalletEnv()).toThrowError(
      /NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID must be a 32-char hex id/,
    )
  })
})
