import { validateAppEnv } from './app'
import { validateEnvironmentEnv } from './environment'
import { validateServerEnv } from './server'
import { validateWalletEnv } from './wallet'

export const validateConfigEnv = () => {
  validateEnvironmentEnv()
  validateAppEnv()
  validateWalletEnv()
  validateServerEnv()
}
