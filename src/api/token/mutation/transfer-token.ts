import type { TransferTokenParams } from '../types/transfer-token-params'
import { sendTransaction, switchChain, writeContract } from '@wagmi/core'
import { erc20Abi, type Hash } from 'viem'
import { wagmiConfig } from '@/lib/common/web3/wagmi'
import { amountToRawAmount } from '@/lib/utils/formatter/misc'

export async function transferToken(params: TransferTokenParams): Promise<Hash> {
  await switchChain(wagmiConfig, { chainId: params.chainId })

  if (params.address == null) {
    const hash = await sendTransaction(wagmiConfig, {
      chainId: params.chainId,
      to: params.to,
      value: amountToRawAmount(params.amount, params.decimals),
    })
    return hash
  }
  const hash = await writeContract(wagmiConfig, {
    chainId: params.chainId,
    address: params.address,
    account: params.account,
    abi: erc20Abi,
    functionName: 'transfer',
    args: [params.to, amountToRawAmount(params.amount, params.decimals)],
  })
  return hash
}
