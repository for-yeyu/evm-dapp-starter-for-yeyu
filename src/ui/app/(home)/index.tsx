import type { ComponentProps, FC } from 'react'
import Link from 'next/link'
import { appConfig } from '@/configs/app'
import { environmentConfig } from '@/configs/environment'
import { walletConfig } from '@/configs/wallet'
import { ServerConfig } from '@/ui/app/(home)/server-config'

export const HomePage: FC<ComponentProps<'div'>> = () => {
  return (
    <div className="container">
      <h1>Home</h1>
      <div className="mt-3 space-y-1">
        <div>Environment: {environmentConfig.environment}</div>
        <div>App Name: {appConfig.appName}</div>
        <div>WalletConnect Project ID: {walletConfig.walletConnectProjectId}</div>
      </div>
      <ServerConfig className="mt-4" />
      <div className="mt-3 flex flex-col space-y-2">
        <Link className="text-primary" href="/examples/transfer">
          Example: Transfer
        </Link>
        <Link className="text-primary" href="/examples/server-time">
          Example: Server Time
        </Link>
      </div>
    </div>
  )
}
