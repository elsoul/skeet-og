import { execSyncCmd } from '@/lib/execSyncCmd'
import {
  getContainerRegion,
  getNetworkConfig,
  getBuidEnvString,
} from '@/lib/getNetworkConfig'

export const runDeploy = async (
  projectId: string,
  appName: string,
  region: string,
  memory: string
) => {
  const cloudRunName = `skeet-${appName}-api`
  const serviceAccount = `${appName}@${projectId}.iam.gserviceaccount.com`
  const cRegion = await getContainerRegion(region)
  const image = `${cRegion}/${projectId}/${cloudRunName}`
  const { connectorName } = await getNetworkConfig(projectId, appName)
  const envString = await getBuidEnvString()
  const shCmd = [
    'gcloud',
    'run',
    'deploy',
    cloudRunName,
    '--service-account',
    serviceAccount,
    '--image',
    image,
    '--memory',
    memory,
    '--region',
    region,
    '--allow-unauthenticated',
    '--platform=managed',
    '--quiet',
    '--vpc-connector',
    connectorName,
    '--set-env-vars',
    envString,
  ]
  await execSyncCmd(shCmd)
}
