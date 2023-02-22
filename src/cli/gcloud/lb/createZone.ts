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
    '--networks',
    'VPC_NETWORK_LIST',
    appConf.loadBalancerName,
    '--project',
    projectId,
  ]
  await execSyncCmd(shCmd)
}
;('gcloud dns managed-zones create NAME \
--description=DESCRIPTION \
--dns-name=DNS_SUFFIX \
--networks=VPC_NETWORK_LIST \
--labels=LABELS \
--visibility=private')
