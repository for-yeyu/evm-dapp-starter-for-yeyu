import { afterEach, describe, expect, it, vi } from 'vitest'
import { ChainId, chainConfig } from '@/configs/chains'
import { evmStore, useEvmStore } from '../evm-store'

vi.mock('zustand', () => ({
  useStore: (store: { getState: () => unknown }, selector: (state: unknown) => unknown) =>
    selector(store.getState()),
}))

afterEach(() => {
  evmStore.setState({
    chainId: chainConfig.supportedChainIds[0],
    connectorChainId: undefined,
    connectorAccount: undefined,
  })
})

describe('evmStore', () => {
  it('starts with the first supported chain', () => {
    expect(evmStore.getState().chainId).toBe(chainConfig.supportedChainIds[0])
    expect(evmStore.getState().connectorChainId).toBeUndefined()
    expect(evmStore.getState().connectorAccount).toBeUndefined()
  })

  it('keeps supported chain ids and falls back for unknown ids', () => {
    evmStore.getState().setChainId(ChainId.ArbitrumSepolia)
    expect(evmStore.getState().chainId).toBe(ChainId.ArbitrumSepolia)

    evmStore.getState().setChainId(999999)
    expect(evmStore.getState().chainId).toBe(chainConfig.supportedChainIds[0])
  })

  it('stores connector connection values', () => {
    const account = '0x0000000000000000000000000000000000000001' as const

    evmStore.getState().setConnectionResult({
      chainId: ChainId.ArbitrumSepolia,
      address: account,
    } as never)

    expect(evmStore.getState().connectorChainId).toBe(ChainId.ArbitrumSepolia)
    expect(evmStore.getState().connectorAccount).toBe(account)
  })

  it('selects state through the hook adapter', () => {
    expect(useEvmStore(state => state.chainId)).toBe(chainConfig.supportedChainIds[0])
  })
})
