import type { NextConfig } from 'next'
import { validateConfigEnv } from './src/configs/validator'

validateConfigEnv()

const config: NextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  typedRoutes: true,
}

export default config
