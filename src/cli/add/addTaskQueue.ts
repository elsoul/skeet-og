import { importConfig } from '@/index'
import { execSyncCmd } from '@/lib/execSyncCmd'
import { TaskQueue } from '@/types/skeetTypes'
import fs from 'fs'
import { Logger } from '@/lib/logger'
import { SKEET_CONFIG_PATH } from '@/lib/getNetworkConfig'

export const addTaskQueue = async (
  projectId: string,
  queueName: string,
  region: string,
  maxAttempts: number = 10,
  maxConcurrent: number = 1,
  maxRate: number = 1,
  maxInterval: number = 10,
  minInterval: number = 1,
  isUpdate: boolean = false
) => {
  const method = isUpdate ? 'update' : 'create'
  const taskQueue: TaskQueue = {
    queueName,
    location: region,
    maxAttempts,
    maxConcurrent,
    maxRate,
    maxInterval,
    minInterval,
  }
  const shCmd = [
    'gcloud',
    'tasks',
    'queues',
    method,
    taskQueue.queueName,
    '--location',
    taskQueue.location,
    '--max-attempts',
    String(taskQueue.maxAttempts),
    '--max-concurrent-dispatches',
    String(taskQueue.maxConcurrent),
    '--max-dispatches-per-second',
    String(taskQueue.maxRate),
    '--max-backoff',
    String(taskQueue.maxInterval),
    '--min-backoff',
    String(taskQueue.minInterval),
    '--project',
    projectId,
  ]
  await execSyncCmd(shCmd)
  if (!isUpdate) await addTaskQueueToConf(taskQueue)
  Logger.success('Successfully Updated skeet-cloud.config.json!')
}

export const addTaskQueueToConf = async (taskQueue: TaskQueue) => {
  const skeetConfig = await importConfig()
  if (skeetConfig.taskQueues) {
    skeetConfig.taskQueues.push(taskQueue)
    fs.writeFileSync(SKEET_CONFIG_PATH, JSON.stringify(skeetConfig, null, 2))
  }
}
