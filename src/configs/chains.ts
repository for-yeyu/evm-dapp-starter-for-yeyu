import type { Chain } from 'viem'
import type { Environment } from './environment'
import { arbitrum, arbitrumSepolia, mainnet, sepolia } from 'viem/chains'
import { environmentConfig } from './environment'

export enum ChainId {
  Mainnet = 1,
  Arbitrum = 42161,
  Sepolia = 11155111,
  ArbitrumSepolia = 421614,
}

const supportedChainIdsByEnvironment: Record<Environment, [ChainId, ChainId]> = {
  production: [ChainId.Mainnet, ChainId.Arbitrum],
  development: [ChainId.Sepolia, ChainId.ArbitrumSepolia],
}

const chains = {
  [ChainId.Mainnet]: mainnet,
  [ChainId.Arbitrum]: arbitrum,
  [ChainId.Sepolia]: sepolia,
  [ChainId.ArbitrumSepolia]: arbitrumSepolia,
} satisfies Record<ChainId, Chain>

const supportedChainIds = supportedChainIdsByEnvironment[environmentConfig.environment]

export const chainConfig = {
  supportedChainIds,
  supportedChains: [chains[supportedChainIds[0]], chains[supportedChainIds[1]]] as [Chain, Chain],
  chains,
}

export type SupportedChainId = (typeof chainConfig.supportedChainIds)[number]
