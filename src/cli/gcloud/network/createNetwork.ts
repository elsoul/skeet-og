import { execSyncCmd } from '@/lib/execSyncCmd'

export const createNetwork = async (appName: string) => {
  const shCmd = ['gcloud', 'compute', 'networks', 'create', appName]
  await execSyncCmd(shCmd)
}
