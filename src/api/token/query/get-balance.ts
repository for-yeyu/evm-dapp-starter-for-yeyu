import type { GetBalanceParams } from '../types/get-balance-params'
import { readContract, getBalance as wagmiGetBalance } from '@wagmi/core'
import { erc20Abi } from 'viem'
import { wagmiConfig } from '@/lib/common/web3/wagmi'
import { rawAmountToAmount } from '@/lib/utils/formatter/misc'

export async function getBalance(params: GetBalanceParams): Promise<string> {
  if (params.address == null) {
    const balance = await wagmiGetBalance(wagmiConfig, {
      chainId: params.chainId,
      address: params.account,
    })
    return rawAmountToAmount(balance.value, params.decimals)
  }
  const balance = await readContract(wagmiConfig, {
    chainId: params.chainId,
    address: params.address,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [params.account],
  })
  return rawAmountToAmount(balance, params.decimals)
}
