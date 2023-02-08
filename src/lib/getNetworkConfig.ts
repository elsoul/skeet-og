export const KEYFILE_PATH = './keyfile.json'
export const GRAPHQL_PATH = './apps/api/src/graphql'
export const PRISMA_SCHEMA_PATH = './apps/api/prisma/schema.prisma'
export const API_PATH = './apps/api'
export const API_ENV_PRODUCTION_PATH = './apps/api/.env.production'

export const defaultEnvArray = [
  'SKEET_ENV=production',
  'NO_PEER_DEPENDENCY_CHECK=1',
  'DATABASE_URL=postgresql://postgres:${{ secrets.SKEET_GCP_DB_PASSWORD }}@${{ secrets.SKEET_GCP_DB_PRIVATE_IP }}:5432/skeet-${{ secrets.SKEET_APP_NAME }}-production?schema=public',
  'SKEET_SECRET_KEY_BASE=${{ secrets.SKEET_SECRET_KEY_BASE }}',
  'SKEET_GCP_PROJECT_ID=${{ secrets.SKEET_GCP_PROJECT_ID }}',
  'SKEET_FB_PROJECT_ID=${{ secrets.SKEET_FB_PROJECT_ID }}',
  'TZ=${{ secrets.TZ }}',
]

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
