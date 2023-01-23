import { execSyncCmd } from '@/lib/execSyncCmd'

export const apiYarn = async () => {
  const shCmd = ['yarn', '--cwd', './apps/api', 'install']
  execSyncCmd(shCmd)
}
