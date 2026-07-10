import { afterEach, describe, expect, it, vi } from 'vitest'
import { validateServerEnv } from '../server'

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('validateServerEnv', () => {
  it('accepts a non-empty server secret', () => {
    vi.stubEnv('JwtSecret', 'server-secret')

    expect(() => validateServerEnv()).not.toThrow()
  })

  it.each(['', '   '])('rejects an empty server secret: %j', secret => {
    vi.stubEnv('JwtSecret', secret)

    expect(() => validateServerEnv()).toThrowError(/JwtSecret is required/)
  })
})
