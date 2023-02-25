import * as Skeet from '@/cli'
import { getIp, setGcloudProject } from '@/cli'
import { importConfig } from '@/index'
import { SkeetCloudConfig } from '@/types/skeetTypes'
import { getNetworkConfig } from '@/lib/getNetworkConfig'
import { Logger } from '@/lib/logger'

export const setupLoadBalancer = async (domain: string) => {
  try {
    const skeetCloudConfig: SkeetCloudConfig = await importConfig()
    await setGcloudProject(skeetCloudConfig.api.projectId)
    const networkConf = await getNetworkConfig(
      skeetCloudConfig.api.projectId,
      skeetCloudConfig.api.appName
    )
    await Skeet.createFixIp(
      skeetCloudConfig.api.projectId,
      skeetCloudConfig.api.region,
      networkConf.loadBalancerIpName,
      true
    )
    await Skeet.createNeg(
      skeetCloudConfig.api.projectId,
      skeetCloudConfig.api.appName,
      skeetCloudConfig.api.region
    )
    await Skeet.createBackend(
      skeetCloudConfig.api.projectId,
      skeetCloudConfig.api.appName
    )
    await Skeet.addBackend(
      skeetCloudConfig.api.projectId,
      skeetCloudConfig.api.appName,
      skeetCloudConfig.api.region
    )
    await Skeet.createLb(
      skeetCloudConfig.api.projectId,
      skeetCloudConfig.api.appName
    )
    await Skeet.createSsl(
      skeetCloudConfig.api.projectId,
      skeetCloudConfig.api.appName,
      domain
    )
    await Skeet.createProxy(
      skeetCloudConfig.api.projectId,
      skeetCloudConfig.api.appName
    )
    await Skeet.createFr(
      skeetCloudConfig.api.projectId,
      skeetCloudConfig.api.appName
    )
    await Skeet.createZone(
      skeetCloudConfig.api.projectId,
      skeetCloudConfig.api.appName,
      domain
    )
    const ip = await getIp(
      skeetCloudConfig.api.projectId,
      networkConf.loadBalancerIpName
    )
    await Skeet.createRecord(
      skeetCloudConfig.api.projectId,
      networkConf.zoneName,
      domain,
      ip
    )
    await Skeet.getZone(
      skeetCloudConfig.api.projectId,
      skeetCloudConfig.api.appName
    )
    await Logger.success(`Successfully created Load Balancer!\n`)
    await Logger.sync(
      `Copy nameServers addresses above and paste them to your DNS settings`
    )
  } catch (error) {
    await Logger.error(`setupLoadBalancer error: ${JSON.stringify(error)}`)
    process.exit(1)
  }
}
