import { SkeetCloudConfig } from '@/index'
import { listSQL } from '@/cli'
import { importConfig } from '@/index'

export const sqlList = async () => {
  const skeetCloudConfig: SkeetCloudConfig = await importConfig()
  await listSQL(skeetCloudConfig.api.projectId)
}
