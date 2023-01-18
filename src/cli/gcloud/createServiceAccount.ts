import { execCmd } from '../../lib/execCmd'

export const createServiceAccount = async (
  projectId: string,
  appName: string
) => {
  const createServiceAccountCmd = [
    'gcloud',
    'iam',
    'service-accounts',
    'create',
    appName,
    "--description='Skeet Service Account'",
    `--display-name=${appName}`,
    '--project',
    projectId,
  ]
  await execCmd(createServiceAccountCmd)
}
