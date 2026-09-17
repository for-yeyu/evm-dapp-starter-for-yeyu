import { describe, expect, it } from 'vitest'
import { BaseError } from '../base'

class TestError extends BaseError {
  name = 'TestError'
}

describe('BaseError', () => {
  it('stores error options', () => {
    const cause = new Error('cause')
    const data = { requestId: 'request-id' }
    const publicData = { field: 'name' }
    const error = new TestError('failed', { cause, data, publicData, needFix: false })

    expect(error.name).toBe('TestError')
    expect(error.message).toBe('failed')
    expect(error.cause).toBe(cause)
    expect(error.data).toEqual(data)
    expect(error.publicData).toEqual(publicData)
    expect(error.needFix).toBe(false)
    expect(error.handled).toBe(false)
  })

  it('does not expose diagnostic data by default', () => {
    const error = new TestError('failed', { data: { secret: 'private-value' } })

    expect(error.publicData).toBeNull()
  })

  it('walks to the last error in the cause chain', () => {
    const cause = new Error('cause')
    const error = new TestError('failed', { cause })

    expect(error.walk()).toBe(cause)
  })

  it('walks to the first matching error', () => {
    const cause = new Error('cause')
    const error = new TestError('failed', { cause })

    expect(error.walk(current => current.message === 'cause')).toBe(cause)
    expect(error.walk(() => false)).toBeNull()
  })
})
