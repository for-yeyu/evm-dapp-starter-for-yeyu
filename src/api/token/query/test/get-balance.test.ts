import type { Address } from 'viem'
import { readContract, getBalance as wagmiGetBalance } from '@wagmi/core'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { rawAmountToAmount } from '@/lib/utils/formatter/misc'
import { getBalance } from '../get-balance'

vi.mock('@wagmi/core', () => ({
  getBalance: vi.fn(),
  readContract: vi.fn(),
}))

vi.mock('@/lib/common/web3/wagmi', () => ({
  wagmiConfig: {},
}))

vi.mock('@/lib/utils/formatter/misc', () => ({
  rawAmountToAmount: vi.fn(),
}))

const account = '0x0000000000000000000000000000000000000001' as Address
const token = '0x0000000000000000000000000000000000000002' as Address

afterEach(() => {
  vi.clearAllMocks()
})

describe('getBalance', () => {
  it('reads a native balance', async () => {
    vi.mocked(wagmiGetBalance).mockResolvedValue({ value: 123n } as never)
    vi.mocked(rawAmountToAmount).mockReturnValue('1.23')

    await expect(
      getBalance({
        chainId: 11155111,
        address: null,
        account,
        decimals: 18,
      }),
    ).resolves.toBe('1.23')

    expect(wagmiGetBalance).toHaveBeenCalledWith(
      {},
      {
        chainId: 11155111,
        address: account,
      },
    )
    expect(rawAmountToAmount).toHaveBeenCalledWith(123n, 18)
  })

  it('reads an ERC-20 balance', async () => {
    vi.mocked(readContract).mockResolvedValue(456n)
    vi.mocked(rawAmountToAmount).mockReturnValue('4.56')

    await expect(
      getBalance({
        chainId: 11155111,
        address: token,
        account,
        decimals: 2,
      }),
    ).resolves.toBe('4.56')

    expect(readContract).toHaveBeenCalledWith(
      {},
      expect.objectContaining({
        chainId: 11155111,
        address: token,
        functionName: 'balanceOf',
        args: [account],
      }),
    )
    expect(rawAmountToAmount).toHaveBeenCalledWith(456n, 2)
  })
})
