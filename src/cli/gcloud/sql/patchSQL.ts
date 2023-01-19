import { execSyncCmd } from '../../../lib/execSyncCmd'

export const patchSQL = async (
  projectId: string,
  appName: string,
  activation: string = '',
  ips: string = ''
) => {
  const shCmd = [
    'gcloud',
    'sql',
    'instances',
    'patch',
    appName,
    '--project',
    projectId,
  ]
  if (activation === 'always' || 'NEVER') {
    shCmd.push('--activation-policy', activation)
  }
  ips ? shCmd.push('--assign-ip', '--authorized-networks', ips, '--quiet') : ''
  await execSyncCmd(shCmd)
}
