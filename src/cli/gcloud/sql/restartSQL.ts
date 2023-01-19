import { execSyncCmd } from '@/lib/execSyncCmd'

export const restartSQL = async (projectId: string, appName: string) => {
  const shCmd = [
    'gcloud',
    'sql',
    'instances',
    'restart',
    appName,
    '--project',
    projectId,
  ]
  await execSyncCmd(shCmd)
}
