import type { Address } from 'viem'
import { sendTransaction, switchChain, writeContract } from '@wagmi/core'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ChainId } from '@/configs/chains'
import { amountToRawAmount } from '@/lib/utils/formatter/misc'
import { transferToken } from '../transfer-token'

vi.mock('@wagmi/core', () => ({
  sendTransaction: vi.fn(),
  switchChain: vi.fn(),
  writeContract: vi.fn(),
}))

vi.mock('@/lib/common/web3/wagmi', () => ({
  wagmiConfig: {},
}))

vi.mock('@/lib/utils/formatter/misc', () => ({
  amountToRawAmount: vi.fn(),
}))

const account = '0x0000000000000000000000000000000000000001' as Address
const token = '0x0000000000000000000000000000000000000002' as Address
const recipient = '0x0000000000000000000000000000000000000003' as Address

afterEach(() => {
  vi.clearAllMocks()
})

describe('transferToken', () => {
  it('sends a native currency transaction', async () => {
    vi.mocked(amountToRawAmount).mockReturnValue(123n)
    vi.mocked(sendTransaction).mockResolvedValue('0xnative')

    await expect(
      transferToken({
        chainId: ChainId.Sepolia,
        address: null,
        account,
        decimals: 18,
        to: recipient,
        amount: '1.23',
      }),
    ).resolves.toBe('0xnative')

    expect(switchChain).toHaveBeenCalledWith({}, { chainId: ChainId.Sepolia })
    expect(sendTransaction).toHaveBeenCalledWith(
      {},
      {
        chainId: ChainId.Sepolia,
        to: recipient,
        value: 123n,
      },
    )
    expect(amountToRawAmount).toHaveBeenCalledWith('1.23', 18)
  })

  it('writes an ERC-20 transfer transaction', async () => {
    vi.mocked(amountToRawAmount).mockReturnValue(456n)
    vi.mocked(writeContract).mockResolvedValue('0xtoken')

    await expect(
      transferToken({
        chainId: ChainId.Sepolia,
        address: token,
        account,
        decimals: 6,
        to: recipient,
        amount: '4.56',
      }),
    ).resolves.toBe('0xtoken')

    expect(switchChain).toHaveBeenCalledWith({}, { chainId: ChainId.Sepolia })
    expect(writeContract).toHaveBeenCalledWith(
      {},
      expect.objectContaining({
        chainId: ChainId.Sepolia,
        address: token,
        account,
        functionName: 'transfer',
        args: [recipient, 456n],
      }),
    )
    expect(amountToRawAmount).toHaveBeenCalledWith('4.56', 6)
  })
})
