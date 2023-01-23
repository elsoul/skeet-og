import { execSyncCmd } from '@/lib/execSyncCmd'
import { getNetworkConfig } from '@/lib/getNetworkConfig'

export type PatchOptions = {
  activation: string
  ips: string
  network: string
}

export const patchSQL = async (
  projectId: string,
  appName: string,
  activation: string = '',
  ips: string = '',
  network: string = ''
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
  const patchOption: PatchOptions = {
    activation,
    ips,
    network,
  }
  if (
    patchOption.activation === 'always' ||
    patchOption.activation === 'NEVER'
  ) {
    shCmd.push('--activation-policy', patchOption.activation)
  }
  if (patchOption.ips !== '') {
    shCmd.push(
      '--assign-ip',
      '--authorized-networks',
      patchOption.ips,
      '--quiet'
    )
  }
  if (patchOption.network !== '') {
    const networkName = (await getNetworkConfig(projectId, appName)).networkName
    shCmd.push('--network', networkName)
  }
  await execSyncCmd(shCmd)
}
