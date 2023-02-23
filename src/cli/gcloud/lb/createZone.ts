import { execSyncCmd } from '@/lib/execSyncCmd'
import { getNetworkConfig } from '@/lib/getNetworkConfig'

export const createZone = async (
  projectId: string,
  appName: string,
  domain: string
) => {
  const appConf = await getNetworkConfig(projectId, appName)
  const shCmd = [
    'gcloud',
    'dns',
    'managed-zones',
    'create',
    appConf.zoneName,
    '--dns-name',
    domain,
    '--visibility',
    'public',
    '--project',
    projectId,
  ]
  await execSyncCmd(shCmd)
}

export const getZone = async (projectId: string, appName: string) => {
  const appConf = await getNetworkConfig(projectId, appName)
  const shCmd = [
    'gcloud',
    'dns',
    'managed-zones',
    'describe',
    appConf.zoneName,
    '--project',
    projectId,
  ]
  await execSyncCmd(shCmd)
}
