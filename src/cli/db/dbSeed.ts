import { execCmd } from '@/lib/execCmd'
import { API_ENV_BUILD_PATH } from '@/lib/getNetworkConfig'

export const dbSeed = async (production: boolean = false) => {
  let shCmd = []
  if (production) {
    shCmd = ['dotenv', '-e', API_ENV_BUILD_PATH, 'yarn', 'db:seed']
  } else {
    shCmd = ['yarn', 'db:seed']
  }
  await execCmd(shCmd)
}
