import { execSyncCmd } from '@/lib/execSyncCmd'
import { API_PATH } from '@/lib/getNetworkConfig'

export const apiTest = async () => {
  const shCmd = ['yarn', '--cwd', API_PATH, 'test']
  execSyncCmd(shCmd)
}
