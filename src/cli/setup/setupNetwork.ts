import * as Skeet from '@/cli'
import { SkeetCloudConfig, importConfig } from '@/index'

export const setupNetwork = async () => {
  const skeetCloudConfig: SkeetCloudConfig = await importConfig()
  await Skeet.runVpcNat(
    skeetCloudConfig.api.projectId,
    skeetCloudConfig.api.appName,
    skeetCloudConfig.api.region
  )
}
