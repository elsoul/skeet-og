import { importConfig } from '@/index'
import { sleep } from '@/utils/time'
import { addTaskQueue, setGcloudProject } from '@/cli'

export const syncTaskQueue = async () => {
  const skeetConfig = await importConfig()
  await setGcloudProject(skeetConfig.api.projectId)
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
