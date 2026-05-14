import { serverConfig } from '@/configs/server'
import { withResponse } from '@/lib/http/next'

export const GET = withResponse(() => {
  return serverConfig
})
