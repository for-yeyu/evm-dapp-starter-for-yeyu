import type { GetSymbolParams } from '../types/get-symbol-params'
import { readContract } from '@wagmi/core'
import { erc20Abi } from 'viem'
import { chainConfig } from '@/configs/chains'
import { wagmiConfig } from '@/lib/common/web3/wagmi'

export async function getSymbol(params: GetSymbolParams): Promise<string> {
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
