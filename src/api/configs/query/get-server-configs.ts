import type { GetServerConfigResult } from '../types/get-server-config-result'
import { apiRequest } from '@/lib/http/ky'

export async function getServerConfig(): Promise<GetServerConfigResult> {
  return await apiRequest<GetServerConfigResult>({
    url: 'configs/server',
  })
}
