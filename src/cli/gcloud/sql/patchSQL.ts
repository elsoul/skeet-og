import { execSyncCmd } from '@/lib/execSyncCmd'

export type PatchOptions = {
  activation: string
  ips: string
}

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
  const patchOption: PatchOptions = {
    activation,
    ips,
  }
  if (
    patchOption.activation === 'always' ||
    patchOption.activation === 'NEVER'
  ) {
    console.log('activation')
    shCmd.push('--activation-policy', patchOption.activation)
  }
  if (patchOption.ips !== '') {
    console.log('ips')
    shCmd.push(
      '--assign-ip',
      '--authorized-networks',
      patchOption.ips,
      '--quiet'
    )
  }
  await execSyncCmd(shCmd)
}
