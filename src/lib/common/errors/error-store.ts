import { createStore } from 'zustand/vanilla'
import { convertMaybeEvmError } from '../web3/wagmi'

type ErrorStoreState = {
  lastError: Error | null
  setLastError: (error: Error | null) => void
}

export const errorStore = createStore<ErrorStoreState>()(set => ({
  lastError: null,
  setLastError: error =>
    set({
      lastError: error == null ? null : convertMaybeEvmError(error),
    }),
}))
