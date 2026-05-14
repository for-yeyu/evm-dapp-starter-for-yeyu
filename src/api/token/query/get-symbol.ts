import type { GetDecimalsParams } from '../types'
import { readContract } from '@wagmi/core'
import { erc20Abi } from 'viem'
import { chainConfig } from '@/configs/chains'
import { wagmiConfig } from '@/lib/common/web3/wagmi'

export async function getSymbol(params: GetDecimalsParams): Promise<string> {
  if (params.address == null) {
    return chainConfig.chains[params.chainId].nativeCurrency.symbol
  }
  const symbol = await readContract(wagmiConfig, {
    chainId: params.chainId,
    address: params.address,
    abi: erc20Abi,
    functionName: 'symbol',
  })
  return symbol
}
