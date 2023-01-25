import { execSyncCmd } from '@/lib/execSyncCmd'

export const runList = async (projectId: string) => {
  const shCmd = ['gcloud', 'run', 'services', 'list', '--project', projectId]
  await execSyncCmd(shCmd)
}
