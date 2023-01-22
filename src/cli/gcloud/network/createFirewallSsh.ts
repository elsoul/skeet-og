import { execSyncCmd } from '@/lib/execSyncCmd'

export const createFirewallSsh = async (appName: string) => {
  const sshName = appName + '-ssh'
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
  ]
  await execSyncCmd(shCmd)
}
