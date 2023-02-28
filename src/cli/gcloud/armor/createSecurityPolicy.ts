import { execSyncCmd } from '@/lib/execSyncCmd'
import { getNetworkConfig } from '@/lib/getNetworkConfig'

export const createSecurityPolicy = async (
  projectId: string,
  appName: string
) => {
  const appConf = await getNetworkConfig(projectId, appName)
  const shCmd = [
    'gcloud',
    'compute',
    'security-policies',
    'create',
    appConf.securityPolicyName,
    '--description',
    'policy for external users',
    '--project',
    projectId,
    '--enable-layer7-ddos-defense',
  ]
  await execSyncCmd(shCmd)
}
