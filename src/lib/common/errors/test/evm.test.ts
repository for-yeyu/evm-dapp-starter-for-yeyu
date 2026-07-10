import { describe, expect, it } from 'vitest'
import { UnknownEvmError, UserRejectedRequestError } from '../evm'

describe('UserRejectedRequestError', () => {
  it('uses the default message and is fixable by the user', () => {
    const error = new UserRejectedRequestError()

    expect(error.name).toBe('UserRejectedRequestError')
    expect(error.message).toBe('User rejected request.')
    expect(error.needFix).toBe(false)
  })

  it('preserves an explicit needFix value', () => {
    const error = new UserRejectedRequestError('Rejected', { needFix: true })

    expect(error.message).toBe('Rejected')
    expect(error.needFix).toBe(true)
  })
})

describe('UnknownEvmError', () => {
  it('uses the default message', () => {
    const error = new UnknownEvmError()

    expect(error.name).toBe('UnknownEvmError')
    expect(error.message).toBe('Unknown EVM error.')
  })
})
