import { execSyncCmd } from '@/lib/execSyncCmd'
import { getNetworkConfig, getContainerRegion } from '@/lib/getNetworkConfig'

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
  const imageName = appName + '-api'
  const shCmd = ['docker', 'build', './apps/api', '-t', imageName]
  execSyncCmd(shCmd)
}

export const apiTag = async (
  projectId: string,
  appName: string,
  region: string
) => {
  const cRegion = await getContainerRegion(region)
  const imageName = appName + '-api'
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
  const imageName = appName + '-api'
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
  const cRegion = await getContainerRegion(region)
  const imageName = 'skeet-' + appName + '-api'
  const imageUrl = cRegion + '/' + projectId + '/' + imageName + ':latest'
  const connectorName = (await getNetworkConfig(projectId, appName))
    .connectorName
  const shCmd = [
    'gcloud',
    'run',
    'deploy',
    imageName,
    '--image',
    imageUrl,
    '--memory',
    memory,
    '--cpu',
    cpu,
    '--quiet',
    '--region',
    region,
    '--allow-unauthenticated',
    '--platform',
    'managed',
    '--port',
    '8080',
    '--project',
    projectId,
    '--vpc-connector',
    connectorName,
  ]
  execSyncCmd(shCmd)
}
