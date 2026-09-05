import { describe, expect, it, vi } from 'vitest'
import { validateAppEnv } from '../app'
import { validateEnvironmentEnv } from '../environment'
import { validateConfigEnv } from '../index'
import { validateWalletEnv } from '../wallet'

vi.mock('../app', () => ({
  validateAppEnv: vi.fn(),
}))

vi.mock('../environment', () => ({
  validateEnvironmentEnv: vi.fn(),
}))

vi.mock('../wallet', () => ({
  validateWalletEnv: vi.fn(),
}))

describe('validateConfigEnv', () => {
  it('runs every environment validator', () => {
    validateConfigEnv()

    expect(validateEnvironmentEnv).toHaveBeenCalledOnce()
    expect(validateAppEnv).toHaveBeenCalledOnce()
    expect(validateWalletEnv).toHaveBeenCalledOnce()
  })
})
