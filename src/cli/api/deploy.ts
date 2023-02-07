import { execSyncCmd } from '@/lib/execSyncCmd'
import {
  getNetworkConfig,
  getContainerRegion,
  API_ENV_PRODUCTION_PATH,
} from '@/lib/getNetworkConfig'
import { getEnvString } from '@/cli/templates/init'

export const runApiDeploy = async (
  projectId: string,
  appName: string,
  region: string,
  memory: string,
  cpu: string
) => {
  await apiBuild(appName)
  await apiTag(projectId, appName, region)
  await apiPush(projectId, appName, region)
  await apiDeploy(projectId, appName, region, memory, cpu)
}

export const apiBuild = async (appName: string) => {
  const imageName = 'skeet-' + appName + '-api'
  const shCmd = ['docker', 'build', './apps/api', '-t', imageName]
  execSyncCmd(shCmd)
}

export const apiTag = async (
  projectId: string,
  appName: string,
  region: string
) => {
  const cRegion = await getContainerRegion(region)
  const imageName = 'skeet-' + appName + '-api'
  const imageUrl = cRegion + '/' + projectId + '/' + imageName + ':latest'
  const shCmd = ['docker', 'tag', imageName, imageUrl]
  execSyncCmd(shCmd)
}

export const apiPush = async (
  projectId: string,
  appName: string,
  region: string
) => {
  const cRegion = await getContainerRegion(region)
  const imageName = 'skeet-' + appName + '-api'
  const imageUrl = cRegion + '/' + projectId + '/' + imageName + ':latest'
  const shCmd = ['docker', 'push', imageUrl]
  execSyncCmd(shCmd)
}

export const apiDeploy = async (
  projectId: string,
  appName: string,
  region: string,
  memory: string,
  cpu: string
) => {
  const cloudRunName = `skeet-${appName}-api`
  const serviceAccount = `${appName}@${projectId}.iam.gserviceaccount.com`
  const cRegion = await getContainerRegion(region)
  const image = `${cRegion}/${projectId}/${cloudRunName}`
  const { connectorName } = await getNetworkConfig(projectId, appName)
  const envString = await getEnvString(API_ENV_PRODUCTION_PATH)
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
    '--cpu',
    cpu,
    '--region',
    region,
    '--allow-unauthenticated',
    '--platform=managed',
    '--quiet',
    '--vpc-connector',
    connectorName,
    '--project',
    projectId,
    '--set-env-vars',
    envString,
  ]
  await execSyncCmd(shCmd)
}
