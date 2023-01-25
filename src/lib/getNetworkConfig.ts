export const getNetworkConfig = async (projectId: string, appName: string) => {
  return {
    projectId,
    appName,
    instanceName: appName + '-db',
    networkName: appName + '-network',
    firewallTcpName: appName + '-fw-tcp',
    firewallSshName: appName + '-fw-ssh',
    natName: appName + '-nat',
    routerName: appName + '-router',
    subnetName: appName + '-subnet',
    connectorName: appName + '-connector',
    ipName: appName + '-external-ip',
    ipRangeName: appName + '-ip-range',
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
