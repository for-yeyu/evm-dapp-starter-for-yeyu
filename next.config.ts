import type { NextConfig } from 'next'
import { validateConfigEnv } from './src/configs/validator'

validateConfigEnv()

const config: NextConfig = {}

export default config
