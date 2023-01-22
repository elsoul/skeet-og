import { execSyncCmd } from '@/lib/execSyncCmd'
import { GCP_IP_RANGE } from '.'

export const createFirewallTcp = async (appName: string) => {
  const shCmd = [
    'gcloud',
    'compute',
    'firewall-rules',
    'create',
    appName,
    '--allow',
    'tcp,udp,icmp',
    '--source-ranges',
    GCP_IP_RANGE,
  ]
  await execSyncCmd(shCmd)
}
