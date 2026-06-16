import type { Address } from 'viem'
import type { SupportedChainId } from '@/configs/chains'

export type TransferTokenParams = {
  chainId: SupportedChainId
  address: Address | null
  account: Address
  decimals: number
  to: Address
  amount: string
}
