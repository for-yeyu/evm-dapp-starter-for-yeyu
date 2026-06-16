import type { Address } from 'viem'
import type { SupportedChainId } from '@/configs/chains'

export type GetBalanceParams = {
  chainId: SupportedChainId
  address: Address | null
  account: Address
  decimals: number
}
