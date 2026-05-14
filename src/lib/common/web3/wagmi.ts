import { getDefaultWallets } from '@rainbow-me/rainbowkit'
import { createConfig, BaseError as WagmiBaseError } from '@wagmi/core'
import {
  createClient,
  http,
  BaseError as ViemBaseError,
  UserRejectedRequestError as ViemUserRejectedRequestError,
} from 'viem'
import { appConfig } from '@/configs/app'
import { chainConfig } from '@/configs/chains'
import { walletConfig } from '@/configs/wallet'
import { UnknownEvmError, UserRejectedRequestError } from '../errors/evm'

export const wagmiConfig = createConfig({
  chains: chainConfig.supportedChains,
  client: ({ chain }) => {
    return createClient({ chain, transport: http() })
  },
  connectors:
    typeof window !== 'undefined'
      ? getDefaultWallets({
          appName: appConfig.appName,
          projectId: walletConfig.walletConnectProjectId,
        }).connectors
      : undefined,
})

export function convertMaybeEvmError(error: Error): Error {
  if (error instanceof WagmiBaseError) {
    return new UnknownEvmError(error.shortMessage, { cause: error })
  }
  if (error instanceof ViemBaseError) {
    if (error.walk(error => error instanceof ViemUserRejectedRequestError) != null) {
      return new UserRejectedRequestError(undefined, { cause: error })
    }
    return new UnknownEvmError(error.shortMessage, { cause: error })
  }
  return error
}
