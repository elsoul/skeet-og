import * as Skeet from '@/cli'
import { setGcloudProject } from '@/cli'
import { KEYFILE_PATH } from '@/lib/getNetworkConfig'
import { SkeetCloudConfig } from '@/types/skeetTypes'
import { sleep } from '@/utils/time'
import fs from 'fs'

export const setupGcp = async (skeetCloudConfig: SkeetCloudConfig) => {
  await setGcloudProject(skeetCloudConfig.api.projectId)
  await Skeet.runEnableAllPermission(skeetCloudConfig.api.projectId)
  await Skeet.createServiceAccount(
    skeetCloudConfig.api.projectId,
    skeetCloudConfig.api.appName
  )
  await Skeet.createServiceAccountKey(
    skeetCloudConfig.api.projectId,
    skeetCloudConfig.api.appName
  )
  await sleep(2000)
  await Skeet.addJsonEnv()
  await sleep(2000)
  await Skeet.dockerLogin()
  await sleep(2000)
  fs.rmSync(KEYFILE_PATH)
  await Skeet.runAddAllRole(
    skeetCloudConfig.api.projectId,
    skeetCloudConfig.api.appName
  )
  await Skeet.runVpcNat(
    skeetCloudConfig.api.projectId,
    skeetCloudConfig.api.appName,
    skeetCloudConfig.api.region
  )
}
