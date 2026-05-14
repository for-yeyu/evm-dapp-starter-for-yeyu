import type { Address } from 'viem'
import type { SupportedChainId } from '@/configs/chains'

export type GetDecimalsParams = {
  chainId: SupportedChainId
  address: Address | null
}

export type GetSymbolParams = {
  chainId: SupportedChainId
  address: Address | null
}

export type GetBalanceParams = {
  chainId: SupportedChainId
  address: Address | null
  account: Address
  decimals: number
}

export type TransferTokenParams = {
  chainId: SupportedChainId
  address: Address | null
  account: Address
  decimals: number
  to: Address
  amount: string
}
