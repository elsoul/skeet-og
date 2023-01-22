import { execSyncCmd } from '@/lib/execSyncCmd'

export const createConnector = async (
  projectId: string,
  appName: string,
  region: string,
  subnet: string
) => {
  const connectorName = appName + '-connector'
  const shCmd = [
    'gcloud',
    'compute',
    'networks',
    'vpc-access',
    'connectors',
    'create',
    connectorName,
    '--region',
    region,
    '--subnet-project',
    projectId,
    '--subnet',
    subnet,
  ]
  await execSyncCmd(shCmd)
}
