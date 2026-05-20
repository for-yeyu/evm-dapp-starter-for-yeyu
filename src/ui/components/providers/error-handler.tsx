'use client'

import type { FC } from 'react'
import { useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { BaseError } from '@/lib/common/errors/base'
import { errorStore } from '@/lib/common/errors/error-store'
import { initializeErrorStore } from '@/lib/runtime/init-error-store'

export const ErrorHandler: FC = () => {
  const recentMessages = useRef<Partial<Record<string, boolean>>>({})

  useEffect(() => {
    const removeErrorStoreListeners = initializeErrorStore()

    const timeoutIds = new Set<number>()
    const unsubscribe = errorStore.subscribe(state => {
      const currentError = state.lastError

      if (currentError == null) {
        return
      }

      state.setLastError(null)

      if (currentError instanceof BaseError) {
        const handleTimeoutId = window.setTimeout(() => {
          timeoutIds.delete(handleTimeoutId)

          if (!currentError.handled) {
            currentError.handled = true

            if (recentMessages.current[currentError.message] !== true) {
              recentMessages.current[currentError.message] = true

              toast.error(currentError.message)

              const resetTimeoutId = window.setTimeout(() => {
                timeoutIds.delete(resetTimeoutId)
                delete recentMessages.current[currentError.message]
              }, 1000)

              timeoutIds.add(resetTimeoutId)
            }
          }
        })

        timeoutIds.add(handleTimeoutId)

        if (currentError.needFix) {
          console.error(currentError)
        } else {
          // biome-ignore lint/suspicious/noConsole: intentional logging for non-critical errors
          console.log(currentError)
        }

        return
      }

      console.error(currentError)
    })

    return () => {
      unsubscribe()
      removeErrorStoreListeners()

      for (const timeoutId of timeoutIds) {
        window.clearTimeout(timeoutId)
      }
      timeoutIds.clear()
    }
  }, [])

  return null
}
