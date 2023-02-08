import { execSyncCmd } from '@/lib/execSyncCmd'
import { API_PATH } from '@/lib/getNetworkConfig'

export const apiYarnStart = async () => {
  const shCmd = ['yarn', '--cwd', API_PATH, 'start']
  execSyncCmd(shCmd)
}
