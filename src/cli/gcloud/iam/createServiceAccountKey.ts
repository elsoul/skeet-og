import { execSyncCmd } from '../../../lib/execSyncCmd'

export const createServiceAccountKey = async (
  projectId: string,
  appName: string
) => {
  const createServiceAccountCmd = [
    'gcloud',
    'iam',
    'service-accounts',
    'keys',
    'create',
    './keyfile.json',
    '--iam-account',
    `${appName}@${projectId}.iam.gserviceaccount.com`,
    '--project',
    projectId,
  ]
  await execSyncCmd(createServiceAccountCmd)
}
