import { execCmd } from '@/lib/execCmd'
import { API_ENV_BUILD_PATH } from '@/lib/getNetworkConfig'
export const dbMigrate = async (production: boolean = false) => {
  let shCmd = []
  if (production) {
    shCmd = ['dotenv', '-e', API_ENV_BUILD_PATH, 'yarn', 'db:deploy']
  } else {
    shCmd = ['yarn', 'db:deploy']
  }
  await execCmd(shCmd)
}
