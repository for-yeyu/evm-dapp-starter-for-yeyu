import type { SkipToken } from '@tanstack/react-query'
import type { GetSymbolParams } from '@/api/token/types/get-symbol-params'
import { skipToken, useQuery } from '@tanstack/react-query'
import { getSymbol } from '@/api/token/query/get-symbol'

export function useSymbol(params: GetSymbolParams | SkipToken) {
  return useQuery({
    queryKey: ['symbol', params],
    queryFn:
      params !== skipToken
        ? async () => {
            return await getSymbol(params)
          }
        : skipToken,
    staleTime: Infinity,
  })
}
