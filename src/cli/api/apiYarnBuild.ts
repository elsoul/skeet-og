import { execSyncCmd } from '@/lib/execSyncCmd'
import { API_PATH } from '@/lib/getNetworkConfig'

export const apiYarnBuild = async () => {
  const shCmd = ['yarn', '--cwd', API_PATH, 'build']
  execSyncCmd(shCmd)
}
