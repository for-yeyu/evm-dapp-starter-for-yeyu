import { afterEach, describe, expect, it } from 'vitest'
import { errorStore } from '../../common/errors/error-store'
import { queryClient } from '../react-query'

afterEach(() => {
  errorStore.setState({ lastError: null })
})

describe('queryClient', () => {
  it('uses the shared query defaults', () => {
    expect(queryClient.getDefaultOptions().queries).toMatchObject({
      staleTime: 60_000,
      retry: false,
    })
  })

  it('stores Error instances reported by the query cache', () => {
    const error = new Error('query failed')

    queryClient.getQueryCache().config.onError?.(error, undefined as never)

    expect(errorStore.getState().lastError).toBe(error)
  })

  it('normalizes unknown query errors before storing them', () => {
    queryClient.getQueryCache().config.onError?.('query failed' as never, undefined as never)

    expect(errorStore.getState().lastError).toMatchObject({
      message: 'query failed',
    })
  })
})
