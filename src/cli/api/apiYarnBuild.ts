import { execSyncCmd } from '@/lib/execSyncCmd'

export const apiYarnBuild = async () => {
  const shCmd = ['yarn', '--cwd', './apps/api', 'build']
  execSyncCmd(shCmd)
}
