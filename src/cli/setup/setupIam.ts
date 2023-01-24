import * as Skeet from '@/cli'
import { SkeetCloudConfig, importConfig } from '@/index'

export const setupIam = async () => {
  const skeetCloudConfig: SkeetCloudConfig = await importConfig()
  await Skeet.runEnableAllPermission(skeetCloudConfig.api.projectId)
  await Skeet.createServiceAccount(
    skeetCloudConfig.api.projectId,
    skeetCloudConfig.api.appName
  )
  await Skeet.createServiceAccountKey(
    skeetCloudConfig.api.projectId,
    skeetCloudConfig.api.appName
  )
  await Skeet.runAddAllRole(
    skeetCloudConfig.api.projectId,
    skeetCloudConfig.api.appName
  )
}
