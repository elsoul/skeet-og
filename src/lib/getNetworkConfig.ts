import fs from 'fs'
import { createHash } from 'crypto'
import { execSync } from 'child_process'
import { workerPluginList } from '@/types/skeetTypes'

export const KEYFILE_PATH = './keyfile.json'
export const GRAPHQL_PATH = './apps/api/src/graphql'
export const PRISMA_SCHEMA_PATH = './apps/api/prisma/schema.prisma'
export const API_PATH = './apps/api'
export const API_TYPE_PATH = API_PATH + '/src/types'
export const API_ENV_PRODUCTION_PATH = './apps/api/.env.production'
export const API_ENV_BUILD_PATH = './apps/api/.env.build'
export const WORKER_PATH = './apps/workers'
export const SKEET_CONFIG_PATH = './skeet-cloud.config.json'
export const ROUTE_PACKAGE_JSON_PATH = './package.json'
export const API_REPO_URL = 'https://github.com/elsoul/skeet-api'
export const WORKER_REPO_URL = 'https://github.com/elsoul/skeet-worker'
export const WORKER_SOLANA_TRANSFER_REPO_URL =
  'https://github.com/elsoul/skeet-worker-solana-transfer'
export const ENUM_FILE_PATH = './apps/api/src/graphql'
export const FRONT_APP_REPO_URL = 'https://github.com/elsoul/skeet-app-template'
export const FRONT_APP_PATH = './apps/app'

export enum WorkerPlugins {
  SOLANA_TRANSFER = 'solana-transfer',
  ORCA_SWAP = 'orca-swap',
  JUPITER_SWAP = 'jupiter-swap',
}

export const isWorkerPlugin = async (workerName: string) => {
  if (!Object.values(WorkerPlugins)?.includes(workerName as WorkerPlugins)) {
    return false
  }
  return true
}

export const getPluginData = async (pluginName: string) => {
  try {
    let pluginList: workerPluginList = await import(
      '../lib/workerPluginList.json'
    )
    const plugin = pluginList.filter((value) => value.name === pluginName)
    if (plugin.length === 0) return { id: 0, name: '', port: 0 }
    return plugin[0]
  } catch (error) {
    console.log(`getPluginData: ${error}`)
    return { id: 0, name: '', port: 0 }
  }
}

export const getWorkerEnvPath = async (workerName: string) => {
  return `${WORKER_PATH}/${workerName}/.env`
}
export const getWorkerName = async (appName: string, workerName: string) => {
  return `skeet-${appName}-worker-${workerName}`
}

export const genSecret = async (name: string) => {
  return createHash('sha256').update(name).digest('hex')
}

export const defaultProductionEnvArray = [
  'NO_PEER_DEPENDENCY_CHECK=1',
  'DATABASE_URL=postgresql://postgres:${{ secrets.SKEET_GCP_DB_PASSWORD }}@${{ secrets.SKEET_GCP_DB_PRIVATE_IP }}:5432/skeet-${{ secrets.SKEET_APP_NAME }}-production?schema=public',
  'SKEET_JWT_SALT=${{ secrets.SKEET_JWT_SALT }}',
  'SKEET_BASE_URL=${{ secrets.SKEET_BASE_URL }}',
  'SKEET_CRYPTO_SALT=${{ secrets.SKEET_CRYPTO_SALT }}',
  'SKEET_PW_SALT=${{ secrets.SKEET_PW_SALT }}',
  'SKEET_GCP_PROJECT_ID=${{ secrets.SKEET_GCP_PROJECT_ID }}',
  'SKEET_FB_PROJECT_ID=${{ secrets.SKEET_FB_PROJECT_ID }}',
  'SKEET_API_ENDPOINT_URL=${{ secrets.SKEET_API_ENDPOINT_URL }}',
  'TZ=${{ secrets.TZ }}',
]

export const getBuidEnvArray = async (
  projectId: string,
  fbProjectId: string,
  databaseUrl: string,
  tz: string
) => {
  return [
    'NO_PEER_DEPENDENCY_CHECK=1',
    `SKEET_GCP_PROJECT_ID=${projectId}`,
    `SKEET_FB_PROJECT_ID=${fbProjectId}`,
    `TZ=${tz}`,
    `DATABASE_URL=${databaseUrl}`,
  ]
}

export const getActionsEnvString = async (filePath: string) => {
  const stream = fs.readFileSync(filePath)
  const envArray: Array<string> = String(stream).split('\n')
  let newEnv: Array<string> = []
  for await (const envLine of envArray) {
    let keyAndValue = envLine.match(/([A-Z_]+)="?([^"]*)"?/)
    if (keyAndValue) {
      if (keyAndValue[1].match('SKEET_')) continue
      if (keyAndValue[1] === 'TZ') continue
      const envString =
        `${keyAndValue[1]}=$` + '{{ ' + `secrets.${keyAndValue[1]}` + ' }}'
      newEnv.push(envString)
    }
  }
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
    hash['TZ']
  )
  const newEnv = envArray.filter((value) => {
    if (
      !value.match('SKEET_GCP_PROJECT_ID') &&
      !value.match('SKEET_GCP_DB_PASSWORD') //&&
      // !value.match('SKEET_API_URL') &&
      // !value.match('SKEET_GCP_PROJECT_ID')
    ) {
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
    cloudRunName: `skeet-${appName}-api`,
    instanceName: skeetHeader + '-db',
    networkName: skeetHeader + '-network',
    firewallTcpName: skeetHeader + '-fw-tcp',
    firewallSshName: skeetHeader + '-fw-ssh',
    natName: skeetHeader + '-nat',
    routerName: skeetHeader + '-router',
    subnetName: skeetHeader + '-subnet',
    connectorName: appName + '-con',
    ipName: skeetHeader + '-external-ip',
    loadBalancerIpName: skeetHeader + '-lb-ip',
    ipRangeName: skeetHeader + '-ip-range',
    serviceAccountName: `${appName}@${projectId}.iam.gserviceaccount.com`,
    networkEndpointGroupName: `${skeetHeader}-neg`,
    backendServiceName: `${skeetHeader}-bs`,
    loadBalancerName: `${skeetHeader}-lb`,
    sslName: `${skeetHeader}-ssl`,
    proxyName: `${skeetHeader}-px`,
    forwardingRuleName: `${skeetHeader}-fr`,
    zoneName: `${skeetHeader}-zone`,
    securityPolicyName: `${skeetHeader}-armor`,
  }
}

export const getContainerImageUrl = async (
  projectId: string,
  appName: string,
  region: string,
  workerName: string = '',
  isPlugin: boolean = false
) => {
  const cRegion = await getContainerRegion(region)

  let imageName = ''
  if (workerName !== '' && isPlugin) {
    imageName = 'skeet-worker-' + workerName
  } else if (workerName !== '') {
    imageName = 'skeet-' + appName + '-worker-' + workerName
  } else {
    imageName = 'skeet-' + appName + '-api'
  }

  let containerProjectName = isPlugin ? 'skeet-framework' : projectId
  return cRegion + '/' + containerProjectName + '/' + imageName + ':latest'
}

export const getContainerImageName = async (
  appName: string,
  workerName: string = ''
) => {
  const imageName =
    workerName !== ''
      ? 'skeet-' + appName + '-worker-' + workerName
      : 'skeet-' + appName + '-api'
  return imageName
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

export const getRunUrl = async (
  projectId: string,
  appName: string,
  workerName: string = ''
) => {
  try {
    const runName =
      workerName !== ''
        ? await getWorkerName(appName, workerName)
        : (await getNetworkConfig(projectId, appName)).cloudRunName
    console.log(runName)
    const cmd = `gcloud run services list --project=${projectId} | grep ${runName} | awk '{print $4}'`
    const res = String(execSync(cmd)).replace(/\r?\n/g, '')

    return res
  } catch (error) {
    return ''
  }
}
