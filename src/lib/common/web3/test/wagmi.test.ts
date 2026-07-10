import { BaseError as WagmiBaseError } from '@wagmi/core'
import {
  BaseError as ViemBaseError,
  UserRejectedRequestError as ViemUserRejectedRequestError,
} from 'viem'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { appConfig } from '@/configs/app'
import { chainConfig } from '@/configs/chains'
import { walletConfig } from '@/configs/wallet'
import { UnknownEvmError, UserRejectedRequestError } from '../../errors/evm'
import { convertMaybeEvmError, wagmiConfig } from '../wagmi'

describe('wagmiConfig', () => {
  it('creates a client for a supported chain', () => {
    const client = wagmiConfig.getClient({ chainId: chainConfig.supportedChainIds[0] })

    expect(client.chain.id).toBe(chainConfig.supportedChainIds[0])
  })
})

describe('wagmiConfig browser connectors', () => {
  afterEach(() => {
    vi.doUnmock('@rainbow-me/rainbowkit')
    vi.resetModules()
    vi.unstubAllGlobals()
  })

  it('loads default wallet connectors when window is available', async () => {
    const getDefaultWallets = vi.fn(() => ({ connectors: [] }))

    vi.resetModules()
    vi.doMock('@rainbow-me/rainbowkit', () => ({ getDefaultWallets }))
    vi.stubGlobal('window', {
      addEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
      removeEventListener: vi.fn(),
    })

    await import('../wagmi')

    expect(getDefaultWallets).toHaveBeenCalledWith({
      appName: appConfig.appName,
      projectId: walletConfig.walletConnectProjectId,
    })
  })
})

describe('convertMaybeEvmError', () => {
  it('converts Wagmi errors to UnknownEvmError', () => {
    const error = new WagmiBaseError('wagmi failure')
    const result = convertMaybeEvmError(error)

    expect(result).toBeInstanceOf(UnknownEvmError)
    expect(result.message).toBe('wagmi failure')
    expect(result.cause).toBe(error)
  })

  it('converts user rejection errors to UserRejectedRequestError', () => {
    const error = new ViemUserRejectedRequestError(new Error('rejected'))
    const result = convertMaybeEvmError(error)

    expect(result).toBeInstanceOf(UserRejectedRequestError)
    expect(result.message).toBe('User rejected request.')
    expect(result.cause).toBe(error)
  })

  it('converts other Viem errors to UnknownEvmError', () => {
    const error = new ViemBaseError('viem failure')
    const result = convertMaybeEvmError(error)

    expect(result).toBeInstanceOf(UnknownEvmError)
    expect(result.message).toBe('viem failure')
    expect(result.cause).toBe(error)
  })

  it('returns regular errors unchanged', () => {
    const error = new Error('regular failure')

    expect(convertMaybeEvmError(error)).toBe(error)
  })
})
