import { importConfig } from '@/index'
import { execSyncCmd } from '@/lib/execSyncCmd'
import { getNetworkConfig } from '@/lib/getNetworkConfig'
import { sleep } from '@/utils/time'
import { addTaskQueue } from '@/cli'

export const syncGcloud = async () => {
  await syncSql()
  await syncTaskQueue()
}

export const syncSql = async () => {
  const skeetConfig = await importConfig()
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
    String(skeetConfig.api.db.memory),
    '--project',
    skeetConfig.api.projectId,
  ]
  await execSyncCmd(shCmd)
}

export const syncTaskQueue = async () => {
  const skeetConfig = await importConfig()
  if (skeetConfig.taskQueues) {
    for await (const taskQueue of skeetConfig.taskQueues) {
      const isUpdate = true
      await addTaskQueue(
        skeetConfig.api.projectId,
        taskQueue.queueName,
        taskQueue.location,
        taskQueue.maxAttempts,
        taskQueue.maxConcurrent,
        taskQueue.maxRate,
        taskQueue.maxInterval,
        taskQueue.minInterval,
        isUpdate
      )
      await sleep(200)
    }
  }
}
