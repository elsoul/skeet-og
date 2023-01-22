import { execSyncCmd } from '@/lib/execSyncCmd'

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
  const imageName = appName + '-api'
  const imageUrl = cRegion + '/' + projectId + '/' + imageName + ':latest'
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
  ]
  execSyncCmd(shCmd)
}

export const getContainerRegion = async (region: string) => {
  switch (region) {
    case region.match('asia')?.input:
      return 'asia.gcr.io'
    case region.match('eu')?.input:
      return 'eu.gcr.io'
    default:
      return 'gcr.io'
  }
}
