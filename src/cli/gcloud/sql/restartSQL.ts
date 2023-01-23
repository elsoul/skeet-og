import { execSyncCmd } from '@/lib/execSyncCmd'
import { getNetworkConfig } from '@/lib/getNetworkConfig'

export const restartSQL = async (projectId: string, appName: string) => {
  const instanceName = (await getNetworkConfig(projectId, appName)).instanceName
  const shCmd = [
    'gcloud',
    'sql',
    'instances',
    'restart',
    instanceName,
    '--project',
    projectId,
  ]
  await execSyncCmd(shCmd)
}
