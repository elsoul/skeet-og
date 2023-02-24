import { execSyncCmd } from '@/lib/execSyncCmd'

export const gitInit = async () => {
  const cmdLine = ['git', 'init', '--initial-branch', 'main']
  await execSyncCmd(cmdLine)
}

export const gitCryptInit = async () => {
  const cmdLine = ['git', 'crypt', 'init']
  await execSyncCmd(cmdLine)
}
