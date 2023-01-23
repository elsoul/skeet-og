import { execSyncCmd } from '@/lib/execSyncCmd'
import { getNetworkConfig } from '@/lib/getNetworkConfig'

export const createFirewallSsh = async (projectId: string, appName: string) => {
  const sshName = (await getNetworkConfig(projectId, appName)).firewallSshName

  const shCmd = [
    'gcloud',
    'compute',
    'firewall-rules',
    'create',
    sshName,
    '--network',
    appName,
    '--allow',
    'tcp:22,tcp:3389,icmp',
    '--project',
    projectId,
  ]
  await execSyncCmd(shCmd)
}
