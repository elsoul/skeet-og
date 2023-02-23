import { execSyncCmd } from '@/lib/execSyncCmd'
import { getNetworkConfig } from '@/lib/getNetworkConfig'

export const createRecord = async (
  projectId: string,
  zone: string,
  domain: string,
  loadBalancerIp: string,
  isUpdate: boolean = false,
  recordType: string = 'A',
  ttl: string = '30'
) => {
  const method = isUpdate ? 'update' : 'create'
  const shCmd = [
    'gcloud',
    'dns',
    'record-sets',
    method,
    domain,
    '--rrdatas',
    loadBalancerIp,
    '--ttl',
    ttl,
    '--type',
    recordType,
    '--zone',
    zone,
    '--project',
    projectId,
  ]
  await execSyncCmd(shCmd)
}
