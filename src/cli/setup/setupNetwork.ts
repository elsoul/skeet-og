import * as Skeet from '@/cli'
import { setGcloudProject } from '@/cli'
import { importConfig } from '@/index'
import { SkeetCloudConfig } from '@/types/skeetTypes'

export const setupNetwork = async () => {
  const skeetCloudConfig: SkeetCloudConfig = await importConfig()
  await setGcloudProject(skeetCloudConfig.api.projectId)
  await Skeet.runVpcNat(
    skeetCloudConfig.api.projectId,
    skeetCloudConfig.api.appName,
    skeetCloudConfig.api.region
  )
}
