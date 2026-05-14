import { z } from 'zod'

const walletEnvSchema = z.object({
  NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID: z
    .string()
    .trim()
    .regex(/^[0-9a-f]{32}$/i, 'NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID must be a 32-char hex id'),
})

export const validateWalletEnv = () => {
  walletEnvSchema.parse({
    NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
  })
}
