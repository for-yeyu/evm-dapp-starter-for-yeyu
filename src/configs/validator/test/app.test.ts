import { afterEach, describe, expect, it, vi } from 'vitest'
import { validateAppEnv } from '../app'

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('validateAppEnv', () => {
  it('accepts a non-empty application name', () => {
    vi.stubEnv('NEXT_PUBLIC_APP_NAME', 'Test application')

    expect(() => validateAppEnv()).not.toThrow()
  })

  it('rejects a blank application name', () => {
    vi.stubEnv('NEXT_PUBLIC_APP_NAME', '   ')

    expect(() => validateAppEnv()).toThrowError(/NEXT_PUBLIC_APP_NAME is required/)
  })
})
