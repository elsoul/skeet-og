import { execSyncCmd } from '@/lib/execSyncCmd'
import {
  getNetworkConfig,
  API_PATH,
  getContainerImageName,
  getContainerImageUrl,
} from '@/lib/getNetworkConfig'
import { getBuidEnvString } from '@/lib/getNetworkConfig'

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
  const imageName = await getContainerImageName(appName)
  const shCmd = ['docker', 'build', API_PATH, '-t', imageName]
  execSyncCmd(shCmd)
}

export const apiTag = async (
  projectId: string,
  appName: string,
  region: string
) => {
  const imageName = await getContainerImageName(appName)
  const imageUrl = await getContainerImageUrl(projectId, appName, region)
  const shCmd = ['docker', 'tag', imageName, imageUrl]
  execSyncCmd(shCmd)
}

export const apiPush = async (
  projectId: string,
  appName: string,
  region: string
) => {
  const imageUrl = await getContainerImageUrl(projectId, appName, region)
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
  const cloudRunName = await getContainerImageName(appName)
  const image = await getContainerImageUrl(projectId, appName, region)
  const { connectorName, serviceAccountName } = await getNetworkConfig(
    projectId,
    appName
  )
  const envString = await getBuidEnvString()
  const shCmd = [
    'gcloud',
    'run',
    'deploy',
    cloudRunName,
    '--service-account',
    serviceAccountName,
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
