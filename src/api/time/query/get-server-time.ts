import type { GetServerTimeResult } from '../types/get-server-time-result'
import { apiRequest } from '@/lib/http/ky'

export async function getServerTime(): Promise<GetServerTimeResult> {
  const result = await apiRequest<GetServerTimeResult>({
    url: 'time',
  })
  return result
}
