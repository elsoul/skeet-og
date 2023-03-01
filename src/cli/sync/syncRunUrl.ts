import { importConfig } from '@/index'
import {
  API_ENV_PRODUCTION_PATH,
  API_PATH,
  getRunUrl,
  SKEET_CONFIG_PATH,
} from '@/lib/getNetworkConfig'
import { Logger } from '@/lib/logger'
import { SkeetCloudConfig } from '@/types/skeetTypes'
import fs from 'fs'

export const syncRunUrl = async () => {
  const skeetConfig: SkeetCloudConfig = await importConfig()
  if (!skeetConfig.api.hasLoadBalancer) await syncApiUrl(skeetConfig)
  await syncWorkerUrls(skeetConfig)
  await Logger.success(`successfully updated cloud run urls!`)
}

export const syncApiUrl = async (
  skeetConfig: SkeetCloudConfig,
  domain: string = ''
) => {
  skeetConfig.api.cloudRun.url =
    domain !== ''
      ? `https://${domain}`
      : await getRunUrl(skeetConfig.api.projectId, skeetConfig.api.appName)
  fs.writeFileSync(SKEET_CONFIG_PATH, JSON.stringify(skeetConfig, null, 2))
  const addEnvString = `\nSKEET_API_URL=${skeetConfig.api.cloudRun.url}`
  fs.writeFileSync(API_ENV_PRODUCTION_PATH, addEnvString, { flag: 'a' })
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
