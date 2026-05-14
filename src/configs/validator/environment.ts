import { z } from 'zod'

const environmentEnvSchema = z.object({
  NEXT_PUBLIC_ENVIRONMENT: z.enum(['development', 'production']),
})

export const validateEnvironmentEnv = () => {
  environmentEnvSchema.parse({
    NEXT_PUBLIC_ENVIRONMENT: process.env.NEXT_PUBLIC_ENVIRONMENT,
  })
}
