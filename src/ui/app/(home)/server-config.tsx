'use client'

import type { ComponentProps, FC } from 'react'
import { useServerConfigs } from '@/hooks/api/configs/query/use-server-configs'
import { cn } from '@/lib/utils/shadcn'
import { Button } from '@/ui/shadcn/button'

export const ServerConfig: FC<ComponentProps<'div'>> = ({ className, ...props }) => {
  const { data: serverConfig, isFetching: isLoading, isError, error, refetch } = useServerConfigs()

  const onGetServerConfig = () => {
    void refetch()
  }

  const errorMessage =
    isError && error != null
      ? error instanceof Error
        ? error.message
        : 'Failed to load server config'
      : null

  return (
    <div className={cn('space-y-2', className)} {...props}>
      <div className="font-medium">Server Config</div>
      <Button type="button" variant="outline" onClick={onGetServerConfig} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Get Server Config'}
      </Button>
      {serverConfig != null && <div>JwtSecret: {serverConfig.jwtSecret}</div>}
      {errorMessage != null && <div className="text-red-600">Error: {errorMessage}</div>}
    </div>
  )
}
