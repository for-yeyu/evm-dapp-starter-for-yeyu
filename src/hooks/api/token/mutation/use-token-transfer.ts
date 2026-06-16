import type { TransferTokenParams } from '@/api/token/types/transfer-token-params'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { waitForTransactionReceipt } from '@wagmi/core'
import { transferToken } from '@/api/token/mutation/transfer-token'
import { wagmiConfig } from '@/lib/common/web3/wagmi'

export function useTokenTransfer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (params: TransferTokenParams) => {
      const hash = await transferToken(params)
      await waitForTransactionReceipt(wagmiConfig, { chainId: params.chainId, hash })
      queryClient.invalidateQueries({
        queryKey: ['balance', { chainId: params.chainId, account: params.account }],
      })
    },
  })
}
