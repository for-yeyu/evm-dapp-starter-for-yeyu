import { describe, expect, it, vi } from 'vitest'
import { validateAppEnv } from '../app'
import { validateEnvironmentEnv } from '../environment'
import { validateConfigEnv } from '../index'

vi.mock('../app', () => ({
  validateAppEnv: vi.fn(),
}))

vi.mock('../environment', () => ({
  validateEnvironmentEnv: vi.fn(),
}))

describe('validateConfigEnv', () => {
  it('runs every environment validator', () => {
    validateConfigEnv()

    expect(validateEnvironmentEnv).toHaveBeenCalledOnce()
    expect(validateAppEnv).toHaveBeenCalledOnce()
  })
})
