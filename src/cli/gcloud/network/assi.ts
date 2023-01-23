import { execSyncCmd } from '@/lib/execSyncCmd'
import { getNetworkConfig } from '@/lib/getNetworkConfig'

export const createIpRange = async (projectId: string, appName: string) => {
  const networkConfig = await getNetworkConfig(projectId, appName)
  const shCmd = [
    'gcloud',
    'services',
    'vpc-peerings',
    'connect',
    '--service',
    'servicenetworking.googleapis.com',
    '--ranges',
    networkConfig.ipRangeName,
    '--network',
    networkConfig.networkName,
    '--project',
    networkConfig.projectId,
  ]
  await execSyncCmd(shCmd)
}
