import { afterEach, describe, expect, it, vi } from 'vitest'
import { errorStore } from '../../common/errors/error-store'
import { initializeErrorStore } from '../init-error-store'

afterEach(() => {
  vi.unstubAllGlobals()
  errorStore.setState({ lastError: null })
})

describe('initializeErrorStore', () => {
  it('returns a no-op cleanup function during server-side execution', () => {
    const cleanup = initializeErrorStore()

    expect(cleanup()).toBeUndefined()
  })

  it('registers listeners once and forwards browser errors to the store', () => {
    const listeners = new Map<string, EventListener>()
    const addEventListener = vi.fn((type: string, listener: EventListener) => {
      listeners.set(type, listener)
    })
    const removeEventListener = vi.fn((type: string) => {
      listeners.delete(type)
    })

    vi.stubGlobal('window', {
      addEventListener,
      removeEventListener,
    })

    const firstCleanup = initializeErrorStore()
    const secondCleanup = initializeErrorStore()

    expect(addEventListener).toHaveBeenCalledTimes(2)

    const error = new Error('uncaught error')
    const errorEvent = {
      error,
      preventDefault: vi.fn(),
    } as unknown as ErrorEvent
    listeners.get('error')?.(errorEvent)

    expect(errorEvent.preventDefault).toHaveBeenCalledOnce()
    expect(errorStore.getState().lastError).toBe(error)

    const rejection = new Error('unhandled rejection')
    const rejectionEvent = {
      reason: rejection,
      preventDefault: vi.fn(),
    } as unknown as PromiseRejectionEvent
    listeners.get('unhandledrejection')?.(rejectionEvent)

    expect(rejectionEvent.preventDefault).toHaveBeenCalledOnce()
    expect(errorStore.getState().lastError).toBe(rejection)

    const unknownErrorEvent = {
      error: 'unknown error',
      preventDefault: vi.fn(),
    } as unknown as ErrorEvent
    listeners.get('error')?.(unknownErrorEvent)

    const unknownRejectionEvent = {
      reason: 'unknown rejection',
      preventDefault: vi.fn(),
    } as unknown as PromiseRejectionEvent
    listeners.get('unhandledrejection')?.(unknownRejectionEvent)

    expect(unknownErrorEvent.preventDefault).not.toHaveBeenCalled()
    expect(unknownRejectionEvent.preventDefault).not.toHaveBeenCalled()
    expect(errorStore.getState().lastError).toBe(rejection)

    firstCleanup()
    expect(removeEventListener).not.toHaveBeenCalled()

    secondCleanup()
    expect(removeEventListener).toHaveBeenCalledTimes(2)
  })
})
