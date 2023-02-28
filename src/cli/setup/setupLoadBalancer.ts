import * as Skeet from '@/cli'
import { getIp, setGcloudProject } from '@/cli'
import { SkeetCloudConfig } from '@/types/skeetTypes'
import { getNetworkConfig, SKEET_CONFIG_PATH } from '@/lib/getNetworkConfig'
import { Logger } from '@/lib/logger'
import fs from 'fs'

export const setupLoadBalancer = async (
  skeetCloudConfig: SkeetCloudConfig,
  domain: string
) => {
  try {
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
    await Skeet.createCaaRecords(
      skeetCloudConfig.api.projectId,
      networkConf.zoneName,
      domain
    )
    await Skeet.getZone(
      skeetCloudConfig.api.projectId,
      skeetCloudConfig.api.appName
    )
    await hasLoadBalancerTrue(skeetCloudConfig)
    await Logger.success(`Successfully created Load Balancer!\n`)
    await Logger.sync(
      `Copy nameServers addresses above and paste them to your DNS settings`
    )
  } catch (error) {
    await Logger.error(`setupLoadBalancer error: ${JSON.stringify(error)}`)
    process.exit(1)
  }
}

export const hasLoadBalancerTrue = async (skeetConfig: SkeetCloudConfig) => {
  skeetConfig.api.hasLoadBalancer = true
  fs.writeFileSync(SKEET_CONFIG_PATH, JSON.stringify(skeetConfig, null, 2))
}
