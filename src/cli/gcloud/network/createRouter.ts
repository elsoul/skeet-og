import { execSyncCmd } from '@/lib/execSyncCmd'
import { getNetworkConfig } from '@/lib/getNetworkConfig'

export const createRouter = async (
  projectId: string,
  appName: string,
  region: string
) => {
  const networkNames = await getNetworkConfig(projectId, appName)
  const shCmd = [
    'gcloud',
    'compute',
    'routers',
    'create',
    networkNames.routerName,
    '--network',
    networkNames.networkName,
    '--region',
    region,
  ]
  await execSyncCmd(shCmd)
}
