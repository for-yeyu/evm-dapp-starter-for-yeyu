import type { SkipToken } from '@tanstack/react-query'
import type { GetBalanceParams } from '@/api/token/types/get-balance-params'
import { skipToken, useQuery } from '@tanstack/react-query'
import { getBalance } from '@/api/token/query/get-balance'
import { useDecimals } from './use-decimals'

export function useBalance(params: Omit<GetBalanceParams, 'decimals'> | SkipToken) {
  const { data: decimals } = useDecimals(
    params !== skipToken ? { chainId: params.chainId, address: params.address } : skipToken,
  )

  const apiParams = params !== skipToken && decimals != null ? { ...params, decimals } : skipToken

  return useQuery({
    queryKey: ['balance', apiParams],
    queryFn:
      apiParams !== skipToken
        ? async () => {
            return await getBalance(apiParams)
          }
        : skipToken,
  })
}
