import type { Address } from 'viem'
import { readContract } from '@wagmi/core'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ChainId } from '@/configs/chains'
import { getSymbol } from '../get-symbol'

vi.mock('@wagmi/core', () => ({
  readContract: vi.fn(),
}))

vi.mock('@/lib/common/web3/wagmi', () => ({
  wagmiConfig: {},
}))

const token = '0x0000000000000000000000000000000000000002' as Address

afterEach(() => {
  vi.clearAllMocks()
})

describe('getSymbol', () => {
  it('returns the native currency symbol', async () => {
    await expect(
      getSymbol({
        chainId: ChainId.Sepolia,
        address: null,
      }),
    ).resolves.toBe('ETH')

    expect(readContract).not.toHaveBeenCalled()
  })

  it('reads an ERC-20 symbol', async () => {
    vi.mocked(readContract).mockResolvedValue('TEST')

    await expect(
      getSymbol({
        chainId: ChainId.Sepolia,
        address: token,
      }),
    ).resolves.toBe('TEST')

    expect(readContract).toHaveBeenCalledWith(
      {},
      expect.objectContaining({
        chainId: ChainId.Sepolia,
        address: token,
        functionName: 'symbol',
      }),
    )
  })
})
