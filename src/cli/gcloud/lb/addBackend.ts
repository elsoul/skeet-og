import { execSyncCmd } from '@/lib/execSyncCmd'
import { getNetworkConfig } from '@/lib/getNetworkConfig'

export const addBackend = async (
  projectId: string,
  appName: string,
  region: string
) => {
  const appConf = await getNetworkConfig(projectId, appName)
  const shCmd = [
    'gcloud',
    'compute',
    'backend-services',
    'add-backend',
    appConf.backendServiceName,
    '--network-endpoint-group',
    appConf.networkEndpointGroupName,
    '--network-endpoint-group-region',
    region,
    '--global',
    '--project',
    projectId,
  ]
  await execSyncCmd(shCmd)
}
