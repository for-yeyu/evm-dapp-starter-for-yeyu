'use client'

import type { GetConnectionReturnType } from '@wagmi/core'
import type { ComponentProps, FC } from 'react'
import { skipToken } from '@tanstack/react-query'
import { useState } from 'react'
import { isAddress } from 'viem'
import { chainConfig, type SupportedChainId } from '@/configs/chains'
import { useBalance, useDecimals, useSymbol, useTokenTransfer } from '@/hooks/api/token'
import { useEvmStore } from '@/lib/common/web3/evm-store'
import { formatNumber } from '@/lib/utils/formatter/formatters'
import { cn } from '@/lib/utils/shadcn'
import { Button } from '@/ui/shadcn/button'
import { Input } from '@/ui/shadcn/input'

export const TransferPage: FC<ComponentProps<'div'>> = () => {
  const chainId = useEvmStore(state => state.chainId)
  const account = useEvmStore(state => state.connectorAccount)

  return <TransferForm key={chainId} chainId={chainId} account={account} />
}

const TransferForm: FC<{
  chainId: SupportedChainId
  account: GetConnectionReturnType['address']
}> = ({ chainId, account }) => {
  const [tokenChainId, setTokenChainId] = useState<SupportedChainId | null>(null)

  const [tokenText, setTokenText] = useState('')

  const changeToken = (text: string) => {
    setTokenChainId(chainId)
    setTokenText(text)
  }

  const token =
    tokenText === chainConfig.chains[chainId].nativeCurrency.symbol
      ? null
      : isAddress(tokenText)
        ? tokenText
        : skipToken

  const { data: balance } = useBalance(
    chainId === tokenChainId && account != null && token !== skipToken
      ? { chainId, address: token, account }
      : skipToken,
  )

  const { data: symbol } = useSymbol(
    chainId === tokenChainId && token !== skipToken ? { chainId, address: token } : skipToken,
  )

  const { data: decimals } = useDecimals(
    chainId === tokenChainId && token !== skipToken ? { chainId, address: token } : skipToken,
  )

  const [to, setTo] = useState('')

  const [amount, setAmount] = useState('')

  const { mutateAsync: mutationTransfer } = useTokenTransfer()

  const transfer = async () => {
    if (
      chainId === tokenChainId &&
      account != null &&
      token !== skipToken &&
      decimals != null &&
      isAddress(to) &&
      amount !== ''
    ) {
      await mutationTransfer({ chainId, address: token, account, decimals, to, amount })
    }
  }

  return (
    <div className={cn('grid w-160 grid-cols-[auto_1fr] items-center gap-4')}>
      <div>Account:</div>
      <div>{account}</div>

      <div>Token:</div>
      <Input
        placeholder={`${chainConfig.chains[chainId].nativeCurrency.symbol} or 0x...`}
        value={tokenText}
        onChange={event => changeToken(event.target.value)}
      />

      <div>Balance:</div>
      <div>
        {formatNumber(balance)} {symbol}
      </div>

      <div>To:</div>
      <Input placeholder="0x..." value={to} onChange={event => setTo(event.target.value)} />

      <div>Amount:</div>
      <Input placeholder="0.00" value={amount} onChange={event => setAmount(event.target.value)} />

      {/* TODO: loading={transfering}  */}
      <Button className="col-span-2 place-self-start" onClick={transfer}>
        Send
      </Button>
    </div>
  )
}
