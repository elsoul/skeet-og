import { SkeetCloudConfig } from '@/index'
import { patchSQL } from '@/cli'
import { importConfig } from '@/index'

export const sqlIp = async () => {
  const skeetCloudConfig: SkeetCloudConfig = await importConfig()
  await patchSQL(
    skeetCloudConfig.api.projectId,
    skeetCloudConfig.api.appName,
    '',
    skeetCloudConfig.api.db.whiteList
  )
}
