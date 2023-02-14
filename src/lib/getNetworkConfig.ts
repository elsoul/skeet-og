import fs from 'fs'
import { createHash } from 'crypto'

export const KEYFILE_PATH = './keyfile.json'
export const GRAPHQL_PATH = './apps/api/src/graphql'
export const PRISMA_SCHEMA_PATH = './apps/api/prisma/schema.prisma'
export const API_PATH = './apps/api'
export const API_ENV_PRODUCTION_PATH = './apps/api/.env.production'
export const API_ENV_BUILD_PATH = './apps/api/.env.build'

export const genSecret = async (name: string) => {
  return createHash('sha256').update(name).digest('hex')
}

export const defaultProductionEnvArray = [
  'SKEET_ENV=production',
  'NO_PEER_DEPENDENCY_CHECK=1',
  'DATABASE_URL=postgresql://postgres:${{ secrets.SKEET_GCP_DB_PASSWORD }}@${{ secrets.SKEET_GCP_DB_PRIVATE_IP }}:5432/skeet-${{ secrets.SKEET_APP_NAME }}-production?schema=public',
  'SKEET_SECRET_KEY_BASE=${{ secrets.SKEET_SECRET_KEY_BASE }}',
  'SKEET_GCP_PROJECT_ID=${{ secrets.SKEET_GCP_PROJECT_ID }}',
  'SKEET_FB_PROJECT_ID=${{ secrets.SKEET_FB_PROJECT_ID }}',
  'TZ=${{ secrets.TZ }}',
]

export const getBuidEnvArray = async (
  projectId: string,
  fbProjectId: string,
  databaseUrl: string,
  secretKey: string,
  tz: string
) => {
  return [
    'SKEET_ENV=production',
    'NO_PEER_DEPENDENCY_CHECK=1',
    `SKEET_SECRET_KEY_BASE=${secretKey}`,
    `SKEET_GCP_PROJECT_ID=${projectId}`,
    `SKEET_FB_PROJECT_ID=${fbProjectId}`,
    `TZ=${tz}`,
    `DATABASE_URL=${databaseUrl}`,
  ]
}

export const getEnvString = async (filePath: string) => {
  const stream = fs.readFileSync(filePath)
  const envArray: Array<string> = String(stream).split('\n')
  const newEnv = envArray.filter((value) => {
    if (!value.match('SKEET_')) {
      return value
    }
  })
  const returnArray = defaultProductionEnvArray.concat(newEnv)
  return returnArray.join(',')
}

export const getBuidEnvString = async () => {
  const stream = fs.readFileSync(API_ENV_PRODUCTION_PATH)
  const envArray: Array<string> = String(stream).split('\n')
  let hash: { [key: string]: string } = {}
  for await (const line of envArray) {
    const value = line.split('=')
    hash[value[0]] = value[1]
  }
  const dabaseUrl = `postgresql://postgres:${hash['SKEET_GCP_DB_PASSWORD']}@${hash['SKEET_GCP_DB_PRIVATE_IP']}:5432/skeet-${hash['SKEET_APP_NAME']}-production?schema=public`
  const buildEnvArray = await getBuidEnvArray(
    hash['SKEET_GCP_PROJECT_ID'],
    hash['SKEET_GCP_FB_PROJECT_ID'],
    dabaseUrl,
    hash['SKEET_SECRET_KEY_BASE'],
    hash['TZ']
  )
  const newEnv = envArray.filter((value) => {
    if (!value.match('SKEET_') && !value.match('TZ')) {
      return value
    }
  })
  const returnArray = buildEnvArray.concat(newEnv)
  return returnArray.join(',')
}

export const getNetworkConfig = async (projectId: string, appName: string) => {
  const skeetHeader = 'skeet-' + appName
  return {
    projectId,
    appName,
    instanceName: skeetHeader + '-db',
    networkName: skeetHeader + '-network',
    firewallTcpName: skeetHeader + '-fw-tcp',
    firewallSshName: skeetHeader + '-fw-ssh',
    natName: skeetHeader + '-nat',
    routerName: skeetHeader + '-router',
    subnetName: skeetHeader + '-subnet',
    connectorName: appName + '-con',
    ipName: skeetHeader + '-external-ip',
    ipRangeName: skeetHeader + '-ip-range',
    serviceAccountName: `${appName}@${projectId}.iam.gserviceaccount.com`,
  }
}

export const getContainerImageUrl = async (
  projectId: string,
  appName: string,
  region: string
) => {
  const cRegion = await getContainerRegion(region)
  const imageName = 'skeet-' + appName + '-api'
  return cRegion + '/' + projectId + '/' + imageName + ':latest'
}

export const getContainerImageName = async (appName: string) => {
  return 'skeet-' + appName + '-api'
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

export const regionToTimezone = async (region: string) => {
  switch (true) {
    case region.includes('asia'):
      return 'Asia/Tokyo'
    case region.includes('europe'):
      return 'Europe/Amsterdam'
    default:
      return 'America/Los_Angeles'
  }
}
