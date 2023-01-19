import { execSyncCmd } from '@/lib/execSyncCmd'

export const listSQL = async (projectId: string) => {
  const shCmd = ['gcloud', 'sql', 'instances', 'list', '--project', projectId]
  await execSyncCmd(shCmd)
}
