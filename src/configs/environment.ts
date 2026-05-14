export type Environment = 'development' | 'production'

export const environmentConfig = {
  environment: process.env.NEXT_PUBLIC_ENVIRONMENT as Environment,
}
