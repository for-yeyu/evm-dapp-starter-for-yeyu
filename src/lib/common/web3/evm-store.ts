import type { GetConnectionReturnType } from '@wagmi/core'
import { useStore } from 'zustand'
import { createStore } from 'zustand/vanilla'
import { chainConfig, type SupportedChainId } from '@/configs/chains'

type EvmState = {
  chainId: SupportedChainId
  connectorChainId: number | undefined
  connectorAccount: GetConnectionReturnType['address']
}

type EvmActions = {
  setChainId: (chainId: number) => void
  setConnectionResult: (connectionResult: GetConnectionReturnType) => void
}

type EvmStoreState = EvmState & EvmActions

const defaultChainId = chainConfig.supportedChainIds[0]

const toSupportedChainId = (chainId: number): SupportedChainId =>
  chainConfig.supportedChainIds.includes(chainId as SupportedChainId)
    ? (chainId as SupportedChainId)
    : defaultChainId

export const evmStore = createStore<EvmStoreState>()(set => ({
  chainId: defaultChainId,
  connectorChainId: undefined,
  connectorAccount: undefined,
  setChainId: chainId => set({ chainId: toSupportedChainId(chainId) }),
  setConnectionResult: connectionResult =>
    set({
      connectorChainId: connectionResult.chainId,
      connectorAccount: connectionResult.address,
    }),
}))

export function useEvmStore<T>(selector: (state: EvmStoreState) => T): T {
  return useStore(evmStore, selector)
}
