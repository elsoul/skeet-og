import { getNetworkConfig } from '@/lib/getNetworkConfig'
import { createConnector } from './createConnector'
import { createExternalIp } from './createExternalIp'
import { createFirewallSsh } from './createFirewallSsh'
import { createFirewallTcp } from './createFirewallTcp'
import { createNat } from './createNat'
import { createNetwork } from './createNetwork'
import { createRouter } from './createRouter'
import { createSubnet } from './createSubnet'

export const runVpcNat = async (
  projectId: string,
  appName: string,
  region: string
) => {
  const networkConfig = await getNetworkConfig(projectId, appName)
  await createNetwork(projectId, appName)
  await createFirewallTcp(projectId, appName)
  await createFirewallSsh(projectId, appName)
  await createSubnet(projectId, appName, region)
  await createConnector(projectId, appName, region)
  await createRouter(projectId, appName, region)
  await createExternalIp(projectId, appName, region)
  await createNat(projectId, appName, region)
  // setup_private_ip - reffer to SOULs
}
