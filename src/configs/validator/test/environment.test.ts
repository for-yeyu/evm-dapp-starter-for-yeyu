import { afterEach, describe, expect, it, vi } from 'vitest'
import { validateEnvironmentEnv } from '../environment'

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('validateEnvironmentEnv', () => {
  it.each(['development', 'production'])('accepts %s', environment => {
    vi.stubEnv('NEXT_PUBLIC_ENVIRONMENT', environment)

    expect(() => validateEnvironmentEnv()).not.toThrow()
  })

  it('rejects an unsupported environment name', () => {
    vi.stubEnv('NEXT_PUBLIC_ENVIRONMENT', 'test')

    expect(() => validateEnvironmentEnv()).toThrowError()
  })
})
