import { execSyncCmd } from '@/lib/execSyncCmd'
import { getNetworkConfig } from '@/lib/getNetworkConfig'

export const createFixIp = async (
  projectId: string,
  region: string,
  ipName: string
) => {
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
