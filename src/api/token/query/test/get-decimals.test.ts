import type { Address } from 'viem'
import { readContract } from '@wagmi/core'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ChainId } from '@/configs/chains'
import { getDecimals } from '../get-decimals'

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

describe('getDecimals', () => {
  it('returns native currency decimals', async () => {
    await expect(
      getDecimals({
        chainId: ChainId.Sepolia,
        address: null,
      }),
    ).resolves.toBe(18)

    expect(readContract).not.toHaveBeenCalled()
  })

  it('reads ERC-20 decimals', async () => {
    vi.mocked(readContract).mockResolvedValue(6)

    await expect(
      getDecimals({
        chainId: ChainId.Sepolia,
        address: token,
      }),
    ).resolves.toBe(6)

    expect(readContract).toHaveBeenCalledWith(
      {},
      expect.objectContaining({
        chainId: ChainId.Sepolia,
        address: token,
        functionName: 'decimals',
      }),
    )
  })
})
