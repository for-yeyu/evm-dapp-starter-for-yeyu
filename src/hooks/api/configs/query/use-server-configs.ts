import { useQuery } from '@tanstack/react-query'
import { getServerConfig } from '@/api/configs/query/get-server-configs'

export function useServerConfigs() {
  return useQuery({
    queryKey: ['server-configs'],
    queryFn: async () => {
      return await getServerConfig()
    },
  })
}
