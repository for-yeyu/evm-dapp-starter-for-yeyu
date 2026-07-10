import { afterEach, describe, expect, it, vi } from 'vitest'
import { ChainId, chainConfig } from '@/configs/chains'
import { evmStore } from '../../common/web3/evm-store'

const { getChainIdMock, getConnectionMock, watchChainIdMock, watchConnectionMock } = vi.hoisted(
  () => ({
    getChainIdMock: vi.fn(),
    getConnectionMock: vi.fn(),
    watchChainIdMock: vi.fn(),
    watchConnectionMock: vi.fn(),
  }),
)

vi.mock('@wagmi/core', () => ({
  getChainId: getChainIdMock,
  getConnection: getConnectionMock,
  watchChainId: watchChainIdMock,
  watchConnection: watchConnectionMock,
}))

vi.mock('@/lib/common/web3/wagmi', () => ({
  wagmiConfig: {},
}))

import { initializeEvmStore } from '../init-evm-store'

afterEach(() => {
  vi.unstubAllGlobals()
  vi.clearAllMocks()
  evmStore.setState({
    chainId: chainConfig.supportedChainIds[0],
    connectorChainId: undefined,
    connectorAccount: undefined,
  })
})

describe('initializeEvmStore', () => {
  it('returns a no-op cleanup function during server-side execution', () => {
    const cleanup = initializeEvmStore()

    expect(cleanup()).toBeUndefined()
  })

  it('initializes and reference-counts chain and connection watchers', () => {
    const account = '0x0000000000000000000000000000000000000001' as const
    const connection = {
      chainId: ChainId.Sepolia,
      address: account,
    }
    let connectionListener: ((value: unknown) => void) | undefined
    let chainIdListener: (() => void) | undefined
    const stopConnection = vi.fn()
    const stopChainId = vi.fn()

    getConnectionMock.mockReturnValue(connection)
    getChainIdMock.mockReturnValue(ChainId.Sepolia)
    watchConnectionMock.mockImplementation((_config, options) => {
      connectionListener = options.onChange
      return stopConnection
    })
    watchChainIdMock.mockImplementation((_config, options) => {
      chainIdListener = options.onChange
      return stopChainId
    })
    vi.stubGlobal('window', {})

    const firstCleanup = initializeEvmStore()
    const secondCleanup = initializeEvmStore()

    expect(getConnectionMock).toHaveBeenCalledOnce()
    expect(getChainIdMock).toHaveBeenCalledOnce()
    expect(watchConnectionMock).toHaveBeenCalledOnce()
    expect(watchChainIdMock).toHaveBeenCalledOnce()
    expect(evmStore.getState().connectorChainId).toBe(ChainId.Sepolia)
    expect(evmStore.getState().connectorAccount).toBe(account)

    const nextConnection = {
      chainId: ChainId.ArbitrumSepolia,
      address: '0x0000000000000000000000000000000000000002',
    }
    connectionListener?.(nextConnection)
    getChainIdMock.mockReturnValue(ChainId.ArbitrumSepolia)
    chainIdListener?.()

    expect(evmStore.getState().connectorChainId).toBe(ChainId.ArbitrumSepolia)
    expect(evmStore.getState().connectorAccount).toBe(nextConnection.address)
    expect(evmStore.getState().chainId).toBe(ChainId.ArbitrumSepolia)

    firstCleanup()
    expect(stopConnection).not.toHaveBeenCalled()
    expect(stopChainId).not.toHaveBeenCalled()

    secondCleanup()
    expect(stopConnection).toHaveBeenCalledOnce()
    expect(stopChainId).toHaveBeenCalledOnce()
  })
})
