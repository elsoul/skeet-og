import { importConfig } from '@/index'
import { getRunUrl, SKEET_CONFIG_PATH } from '@/lib/getNetworkConfig'
import { Logger } from '@/lib/logger'
import { SkeetCloudConfig } from '@/types/skeetTypes'
import fs from 'fs'

export const syncRunUrl = async () => {
  const skeetConfig: SkeetCloudConfig = await importConfig()
  await syncApiUrl(skeetConfig)
  await syncWorkerUrls(skeetConfig)
  await Logger.success(`successfully updated cloud run urls!`)
}

export const syncApiUrl = async (skeetConfig: SkeetCloudConfig) => {
  const apiUrl = await getRunUrl(
    skeetConfig.api.projectId,
    skeetConfig.api.appName
  )
  skeetConfig.api.cloudRun.url = apiUrl
  fs.writeFileSync(SKEET_CONFIG_PATH, JSON.stringify(skeetConfig, null, 2))
}

export const syncWorkerUrls = async (skeetConfig: SkeetCloudConfig) => {
  if (skeetConfig.workers && skeetConfig.workers.length !== 0) {
    for await (const worker of skeetConfig.workers) {
      worker.cloudRun.url = await getRunUrl(
        skeetConfig.api.projectId,
        skeetConfig.api.appName,
        worker.workerName
      )
    }
  }

  fs.writeFileSync(SKEET_CONFIG_PATH, JSON.stringify(skeetConfig, null, 2))
}
