import { execSyncCmd } from '@/lib/execSyncCmd'

export const createRouter = async (
  appName: string,
  network: string,
  region: string
) => {
  const routerName = appName + '-router'
  const shCmd = [
    'gcloud',
    'compute',
    'routers',
    'create',
    routerName,
    '--network',
    network,
    '--region',
    region,
  ]
  await execSyncCmd(shCmd)
}
