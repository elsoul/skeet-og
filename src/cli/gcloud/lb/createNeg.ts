import { execSyncCmd } from '@/lib/execSyncCmd'
import { getNetworkConfig } from '@/lib/getNetworkConfig'

export const createNeg = async (
  projectId: string,
  appName: string,
  region: string
) => {
  const appConf = await getNetworkConfig(projectId, appName)
  const shCmd = [
    'gcloud',
    'compute',
    'network-endpoint-groups',
    'create',
    appConf.networkEndpointGroupName,
    '--region',
    region,
    '--network-endpoint-type',
    'serverless',
    '--cloud-run-service',
    appConf.cloudRunName,
    '--project',
    projectId,
  ]
  await execSyncCmd(shCmd)
}
