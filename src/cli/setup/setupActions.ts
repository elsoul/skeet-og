import * as Skeet from '@/cli'
import { importConfig } from '@/index'
import { SkeetCloudConfig, WorkerConfig } from '@/types/skeetTypes'
import {
  API_ENV_PRODUCTION_PATH,
  getActionsEnvString,
} from '@/lib/getNetworkConfig'
import { Logger } from '@/lib/logger'
import fs from 'fs'

export const setupActions = async () => {
  try {
    const skeetConfig: SkeetCloudConfig = await importConfig()
    const envString = await getActionsEnvString(API_ENV_PRODUCTION_PATH)
    const result = await Skeet.apiYml(
      envString,
      String(skeetConfig.api.cloudRun.memory),
      String(skeetConfig.api.cloudRun.cpu),
      String(skeetConfig.api.cloudRun.maxConcurrency),
      String(skeetConfig.api.cloudRun.maxInstances),
      String(skeetConfig.api.cloudRun.minInstances)
    )
    fs.writeFileSync(result.filePath, result.body, { flag: 'w' })
    await Logger.success(`Successfully updated ${result.filePath}!`)

    const workerNames = await Skeet.getWorkers()
    if (workerNames.length !== 0) {
      for await (const workerName of workerNames) {
        const workerConf: WorkerConfig = await getWorkerConfig(workerName)
        if (!workerConf) return []
        const result = await Skeet.workerYml(
          workerName,
          envString,
          String(workerConf.cloudRun.memory),
          String(workerConf.cloudRun.cpu),
          String(workerConf.cloudRun.maxConcurrency),
          String(workerConf.cloudRun.maxInstances),
          String(workerConf.cloudRun.minInstances)
        )
        fs.writeFileSync(result.filePath, result.body, { flag: 'w' })
        await Logger.success(`Successfully updated ${result.filePath}!`)
      }
    }
  } catch (error) {
    console.log(`error: ${error}`)
  }
}

export const getWorkerConfig = async (workerName: string) => {
  try {
    const skeetConfig: SkeetCloudConfig = await importConfig()
    const workerConf = {
      workerName,
      cloudRun: {
        cpu: 1,
        memory: 1,
        maxConcurrency: 80,
        maxInstances: 100,
        minInstances: 0,
      },
    }
    if (!skeetConfig.workers || skeetConfig.workers.length === 0)
      return workerConf
    const workerConfig = skeetConfig.workers.find(
      (item) => item.workerName === workerName
    )
    if (!workerConfig) throw new Error('empty!')
    return workerConfig
  } catch (error) {
    throw new Error(`error:${error}`)
  }
}
