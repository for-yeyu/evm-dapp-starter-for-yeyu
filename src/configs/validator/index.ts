import { validateAppEnv } from './app'
import { validateEnvironmentEnv } from './environment'
import { validateWalletEnv } from './wallet'

export const validateConfigEnv = () => {
  validateEnvironmentEnv()
  validateAppEnv()
  validateWalletEnv()
}
