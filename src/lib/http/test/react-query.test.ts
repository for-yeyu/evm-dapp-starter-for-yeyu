import { afterEach, describe, expect, it, vi } from 'vitest'
import { BaseError } from '../../common/errors/base'
import { errorStore } from '../../common/errors/error-store'
import { HttpRequestError } from '../../common/errors/request'
import { queryClient } from '../react-query'

afterEach(() => {
  queryClient.clear()
  errorStore.setState({ lastError: null })
})

describe('queryClient', () => {
  it('uses the shared query defaults', () => {
    expect(queryClient.getDefaultOptions().queries).toMatchObject({
      staleTime: 60_000,
      retry: false,
    })
  })

  it('stores errors from failed queries and preserves their rejection', async () => {
    const error = new Error('query failed')

    await expect(
      queryClient.query({
        queryKey: ['test', 'failed-query'],
        queryFn: () => Promise.reject(error),
      }),
    ).rejects.toBe(error)

    expect(errorStore.getState().lastError).toBe(error)
  })

  it('normalizes unknown query errors before storing them', async () => {
    await expect(
      queryClient.query({
        queryKey: ['test', 'unknown-query-error'],
        queryFn: () => Promise.reject('query failed'),
      }),
    ).rejects.toBe('query failed')

    expect(errorStore.getState().lastError).toMatchObject({
      message: 'query failed',
    })
  })

  it('reports mutation errors even when a local callback consumes them', async () => {
    const error = new HttpRequestError('mutation failed', { needFix: false })
    const onError = vi.fn()
    const mutation = queryClient.getMutationCache().build(queryClient, {
      mutationFn: () => Promise.reject(error),
      onError,
    })

    await expect(mutation.execute(undefined)).rejects.toBe(error)

    expect(errorStore.getState().lastError).toBe(error)
    expect(onError).toHaveBeenCalledWith(error, undefined, undefined, expect.any(Object))
    expect(mutation.state.status).toBe('error')
  })

  it('lets local mutation feedback mark the shared error as handled', async () => {
    const error = new HttpRequestError('invalid input', { needFix: false })
    const mutation = queryClient.getMutationCache().build(queryClient, {
      mutationFn: () => Promise.reject(error),
      onError: currentError => {
        if (currentError instanceof BaseError) {
          currentError.handled = true
        }
      },
    })

    await expect(mutation.execute(undefined)).rejects.toBe(error)

    expect(errorStore.getState().lastError).toBe(error)
    expect(error.handled).toBe(true)
  })

  it('normalizes unknown mutation errors without hiding the failure', async () => {
    const mutation = queryClient.getMutationCache().build(queryClient, {
      mutationFn: () => Promise.reject('mutation failed'),
    })

    await expect(mutation.execute(undefined)).rejects.toBe('mutation failed')

    expect(errorStore.getState().lastError).toBeInstanceOf(Error)
    expect(errorStore.getState().lastError?.message).toBe('mutation failed')
  })

  it('does not report successful queries or mutations as errors', async () => {
    await expect(
      queryClient.query({
        queryKey: ['test', 'successful-query'],
        queryFn: () => Promise.resolve('query result'),
      }),
    ).resolves.toBe('query result')
    const mutation = queryClient.getMutationCache().build(queryClient, {
      mutationFn: () => Promise.resolve('mutation result'),
    })

    await expect(mutation.execute(undefined)).resolves.toBe('mutation result')
    expect(errorStore.getState().lastError).toBeNull()
  })
})
