import { afterEach, describe, expect, it } from 'vitest'
import { errorStore } from '../error-store'

afterEach(() => {
  errorStore.setState({ lastError: null })
})

describe('errorStore', () => {
  it('stores the latest error', () => {
    const error = new Error('request failed')

    errorStore.getState().setLastError(error)

    expect(errorStore.getState().lastError).toBe(error)
  })

  it('clears the latest error', () => {
    errorStore.getState().setLastError(new Error('request failed'))
    errorStore.getState().setLastError(null)

    expect(errorStore.getState().lastError).toBeNull()
  })
})
