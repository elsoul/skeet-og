import { execSyncCmd } from '@/lib/execSyncCmd'

export const addJsonEnv = async () => {
  const filePath = './keyfile.json'
  const cmdLine = ['gh', 'secret', 'set', 'SKEET_GCP_SA_KEY', '<', filePath]
  await execSyncCmd(cmdLine)
}
