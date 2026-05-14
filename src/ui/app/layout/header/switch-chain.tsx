'use client'

import type { ComponentProps, FC } from 'react'
import { switchChain } from '@wagmi/core'
import { chainConfig } from '@/configs/chains'
import { useEvmStore } from '@/lib/common/web3/evm-store'
import { wagmiConfig } from '@/lib/common/web3/wagmi'
import { cn } from '@/lib/utils/shadcn'
import { Button } from '@/ui/shadcn/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/ui/shadcn/dropdown-menu'

export const SwitchChain: FC<ComponentProps<'div'>> = ({ className, ...props }) => {
  const chainId = useEvmStore(state => state.chainId)

  const connectorChainId = useEvmStore(state => state.connectorChainId)

  return (
    <div className={cn('inline-block', className)} {...props}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {connectorChainId != null && connectorChainId !== chainId ? (
            <Button variant="destructive">Wrong network</Button>
          ) : (
            <Button variant="outline">{chainConfig.chains[chainId].name}</Button>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {chainConfig.supportedChainIds.map(chainId => (
            <DropdownMenuItem key={chainId} onClick={() => switchChain(wagmiConfig, { chainId })}>
              {chainConfig.chains[chainId].name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
