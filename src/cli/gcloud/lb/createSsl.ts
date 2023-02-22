import { execSyncCmd } from '@/lib/execSyncCmd'
import { getNetworkConfig } from '@/lib/getNetworkConfig'

export const createSsl = async (
  projectId: string,
  appName: string,
  domain: string
) => {
  const appConf = await getNetworkConfig(projectId, appName)
  const shCmd = [
    'gcloud',
    'compute',
    'ssl-certificates',
    'create',
    appConf.sslName,
    '--domains',
    domain,
    '--project',
    projectId,
  ]
  await execSyncCmd(shCmd)
}
