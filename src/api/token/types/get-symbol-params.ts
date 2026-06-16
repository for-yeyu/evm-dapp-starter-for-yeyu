import type { Address } from 'viem'
import type { SupportedChainId } from '@/configs/chains'

export type GetSymbolParams = {
  chainId: SupportedChainId
  address: Address | null
}
