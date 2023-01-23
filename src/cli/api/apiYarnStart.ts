import { execSyncCmd } from '@/lib/execSyncCmd'

export const apiYarnStart = async () => {
  const shCmd = ['yarn', '--cwd', './apps/api', 'start']
  execSyncCmd(shCmd)
}
