import type { Address } from 'viem'
import type { SupportedChainId } from '@/configs/chains'

export type GetDecimalsParams = {
  chainId: SupportedChainId
  address: Address | null
}
