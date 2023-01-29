export const KEYFILE_PATH = './keyfile.json'
export const GRAPHQL_PATH = './apps/api/src/graphql'
export const PRISMA_SCHEMA_PATH = './apps/api/prisma/schema.prisma'
export const API_PATH = './apps/api'

export type ModelSchema = {
  name: string
  type: string
}

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
