import { SkeetCloudConfig } from '@/types/skeetTypes'
import { patchSQL } from '@/cli'
import { importConfig } from '@/index'
import { getNetworkConfig } from '@/lib/getNetworkConfig'

export const sqlIp = async () => {
  const skeetCloudConfig: SkeetCloudConfig = await importConfig()
  const { networkName } = await getNetworkConfig(
    skeetCloudConfig.api.projectId,
    skeetCloudConfig.api.appName
  )
  await patchSQL(
    skeetCloudConfig.api.projectId,
    skeetCloudConfig.api.appName,
    '',
    skeetCloudConfig.api.db.whiteList,
    networkName
  )
}
