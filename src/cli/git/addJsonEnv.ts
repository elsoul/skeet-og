import { execSyncCmd } from '@/lib/execSyncCmd'

export const addJsonEnv = async () => {
  const filePath = './keyfile.json'
  const cmdLine = ['gh', 'secret', 'set', 'SKEET_GCP_SA_KEY', '<', filePath]
  console.log(cmdLine)
  let a = await execSyncCmd(cmdLine)
  console.log(a)
}
