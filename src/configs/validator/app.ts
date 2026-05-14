import { z } from 'zod'

const appEnvSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().trim().min(1, 'NEXT_PUBLIC_APP_NAME is required'),
})

export const validateAppEnv = () => {
  appEnvSchema.parse({
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  })
}
