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
  return {
    projectId,
    appName,
    instanceName: 'skeet-' + appName + '-db',
    networkName: 'skeet-' + appName + '-network',
    firewallTcpName: 'skeet-' + appName + '-fw-tcp',
    firewallSshName: 'skeet-' + appName + '-fw-ssh',
    natName: 'skeet-' + appName + '-nat',
    routerName: 'skeet-' + appName + '-router',
    subnetName: 'skeet-' + appName + '-subnet',
    connectorName: appName + '-con',
    ipName: 'skeet-' + appName + '-external-ip',
    ipRangeName: 'skeet-' + appName + '-ip-range',
  }
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
