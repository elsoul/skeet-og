import { importConfig } from '@/index'
import { execSyncCmd } from '@/lib/execSyncCmd'
import { getNetworkConfig } from '@/lib/getNetworkConfig'
import { setGcloudProject } from '../gcloud'

export const syncSql = async () => {
  const skeetConfig = await importConfig()
  await setGcloudProject(skeetConfig.api.projectId)
  const networkConfig = await getNetworkConfig(
    skeetConfig.api.projectId,
    skeetConfig.api.appName
  )
  const shCmd = [
    'gcloud',
    'sql',
    'instances',
    'patch',
    networkConfig.instanceName,
    '--storage-size',
    String(skeetConfig.api.db.storageSize),
    '--cpu',
    String(skeetConfig.api.db.cpu),
    '--memory',
    skeetConfig.api.db.memory,
    '--project',
    skeetConfig.api.projectId,
  ]
  await execSyncCmd(shCmd)
}
