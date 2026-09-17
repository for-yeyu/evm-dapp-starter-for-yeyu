import { z } from 'zod'

const appEnvSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().trim().min(1, 'NEXT_PUBLIC_APP_NAME is required'),
  NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID: z
    .string()
    .trim()
    .regex(/^[0-9a-f]{32}$/i, 'NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID must be a 32-char hex id'),
})

export const validateAppEnv = () => {
  appEnvSchema.parse({
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
  })
}
