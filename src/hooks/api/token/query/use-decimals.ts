import type { SkipToken } from '@tanstack/react-query'
import type { GetDecimalsParams } from '@/api/token/types/get-decimals-params'
import { skipToken, useQuery } from '@tanstack/react-query'
import { getDecimals } from '@/api/token/query/get-decimals'

export function useDecimals(params: GetDecimalsParams | SkipToken) {
  return useQuery({
    queryKey: ['decimals', params],
    queryFn:
      params !== skipToken
        ? async () => {
            return await getDecimals(params)
          }
        : skipToken,
    staleTime: Infinity,
  })
}
