import { execSyncCmd } from '@/lib/execSyncCmd'
import { GCP_IP_RANGE } from '.'

export const createSubnet = async (
  appName: string,
  network: string,
  region: string
) => {
  const subnetName = appName + '-subnet'
  const shCmd = [
    'gcloud',
    'compute',
    'networks',
    'subnets',
    'create',
    subnetName,
    '--range',
    GCP_IP_RANGE,
    '--network',
    network,
    '--region',
    region,
  ]
  await execSyncCmd(shCmd)
}
