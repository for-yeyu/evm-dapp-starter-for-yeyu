import { useQuery } from '@tanstack/react-query'
import { getServerTime } from '@/api/time/query/get-server-time'

export function useServerTime() {
  return useQuery({
    queryKey: ['server-time'],
    queryFn: async () => {
      return await getServerTime()
    },
  })
}
