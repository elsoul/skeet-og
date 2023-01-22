import { execSyncCmd } from '@/lib/execSyncCmd'

export const createNat = async (
  projectId: string,
  appName: string,
  region: string,
  subnet: string
) => {
  const natName = appName + '-nat'
  const routerName = appName + '-router'
  const subnetName = appName + '-subnet'
  const ipName = appName + '-ip'
  const shCmd = [
    'gcloud',
    'compute',
    'routers',
    'nats',
    'create',
    natName,
    '--router',
    routerName,
    '--region',
    region,
    '--nat-custom-subnet-ip-ranges',
    subnetName,
    '--nat-external-ip-pool',
    ipName,
  ]
  await execSyncCmd(shCmd)
}
