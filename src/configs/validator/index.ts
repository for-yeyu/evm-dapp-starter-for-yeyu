import { validateAppEnv } from './app'
import { validateEnvironmentEnv } from './environment'

export const validateConfigEnv = () => {
  validateEnvironmentEnv()
  validateAppEnv()
}
