'use client'

import type { FC, MutableRefObject } from 'react'
import { useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { BaseError } from '@/lib/common/errors/base'
import { errorStore } from '@/lib/common/errors/error-store'
import { initializeErrorStore } from '@/lib/runtime/init-error-store'

function clearTimeouts(timeoutIds: Set<number>) {
  for (const timeoutId of timeoutIds) {
    window.clearTimeout(timeoutId)
  }
  timeoutIds.clear()
}

function scheduleMessageRelease(
  message: string,
  recentMessages: MutableRefObject<Partial<Record<string, boolean>>>,
  timeoutIds: Set<number>,
) {
  const timeoutId = window.setTimeout(() => {
    timeoutIds.delete(timeoutId)
    delete recentMessages.current[message]
  }, 1000)

  timeoutIds.add(timeoutId)
}

function reportBaseError(
  error: BaseError,
  recentMessages: MutableRefObject<Partial<Record<string, boolean>>>,
  timeoutIds: Set<number>,
) {
  const timeoutId = window.setTimeout(() => {
    timeoutIds.delete(timeoutId)

    if (error.handled) {
      return
    }

    error.handled = true

    if (recentMessages.current[error.message] === true) {
      return
    }

    recentMessages.current[error.message] = true
    toast.error(error.message)
    scheduleMessageRelease(error.message, recentMessages, timeoutIds)
  })

  timeoutIds.add(timeoutId)

  if (error.needFix) {
    console.error(error)
    return
  }

  // biome-ignore lint/suspicious/noConsole: intentional logging for non-critical errors
  console.log(error)
}

function reportError(
  error: Error,
  recentMessages: MutableRefObject<Partial<Record<string, boolean>>>,
  timeoutIds: Set<number>,
) {
  if (error instanceof BaseError) {
    reportBaseError(error, recentMessages, timeoutIds)
    return
  }

  console.error(error)
}

function initializeErrorHandler(
  recentMessages: MutableRefObject<Partial<Record<string, boolean>>>,
  timeoutIds: Set<number>,
) {
  const removeErrorStoreListeners = initializeErrorStore()
  const unsubscribe = errorStore.subscribe(state => {
    const currentError = state.lastError

    if (currentError == null) {
      return
    }

    state.setLastError(null)
    reportError(currentError, recentMessages, timeoutIds)
  })

  return () => {
    unsubscribe()
    removeErrorStoreListeners()
    clearTimeouts(timeoutIds)
    recentMessages.current = {}
  }
}

export const ErrorHandler: FC = () => {
  const recentMessages = useRef<Partial<Record<string, boolean>>>({})
  const timeoutIds = useRef<Set<number> | null>(null)

  useEffect(() => {
    if (timeoutIds.current === null) {
      timeoutIds.current = new Set()
    }

    return initializeErrorHandler(recentMessages, timeoutIds.current)
  }, [])

  return null
}
