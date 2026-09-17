import { afterEach, describe, expect, it, vi } from 'vitest'
import { validateAppEnv } from '../app'

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('validateAppEnv', () => {
  it('accepts valid public application configuration', () => {
    vi.stubEnv('NEXT_PUBLIC_APP_NAME', 'Test application')
    vi.stubEnv('NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID', '83333dd2a970d5644e1318f9370b15a1')

    expect(() => validateAppEnv()).not.toThrow()
  })

  it('rejects a blank application name', () => {
    vi.stubEnv('NEXT_PUBLIC_APP_NAME', '   ')
    vi.stubEnv('NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID', '83333dd2a970d5644e1318f9370b15a1')

    expect(() => validateAppEnv()).toThrowError(/NEXT_PUBLIC_APP_NAME is required/)
  })

  it('rejects an invalid wallet connect project id', () => {
    vi.stubEnv('NEXT_PUBLIC_APP_NAME', 'Test application')
    vi.stubEnv('NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID', 'invalid')

    expect(() => validateAppEnv()).toThrowError(
      /NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID must be a 32-char hex id/,
    )
  })
})
