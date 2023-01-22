import { execSyncCmd } from '@/lib/execSyncCmd'

export const createExternalIp = async (appName: string, region: string) => {
  const ipName = appName + '-ip'
  const shCmd = [
    'gcloud',
    'compute',
    'addresses',
    'create',
    ipName,
    '--region',
    region,
  ]
  await execSyncCmd(shCmd)
}
