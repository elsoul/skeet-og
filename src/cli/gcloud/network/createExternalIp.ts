import { execSyncCmd } from '@/lib/execSyncCmd'
import { getNetworkConfig } from '@/lib/getNetworkConfig'

export const createExternalIp = async (
  projectId: string,
  appName: string,
  region: string
) => {
  const ipName = (await getNetworkConfig(projectId, appName)).ipName

  const shCmd = [
    'gcloud',
    'compute',
    'addresses',
    'create',
    ipName,
    '--region',
    region,
    '--project',
    projectId,
  ]
  await execSyncCmd(shCmd)
}
