import { SkeetCloudConfig } from '@/index'
import { patchSQL } from '@/cli'
import { importConfig } from '@/index'

export const sqlStop = async () => {
  const skeetCloudConfig: SkeetCloudConfig = await importConfig()
  await patchSQL(
    skeetCloudConfig.api.projectId,
    skeetCloudConfig.api.appName,
    'NEVER'
  )
}
