import { Logger } from '@/lib/logger'
import { importConfig } from '@/index'
import {
  setupActions,
  addWorkerEnv,
  updateSkeetCloudConfig,
  addWorkerToPackageJson,
  getWorkerConfig,
  cloudRunDeploy,
} from '@/cli'

export const addWorkerPlugin = async (pluginName: string) => {
  const skeetConfig = await importConfig()
  const workerName = pluginName
  await updateSkeetCloudConfig(workerName)
  await addWorkerToPackageJson(workerName)
  await setupActions()
  const isWorkerPlugin = true
  const workerConf = await getWorkerConfig(pluginName)
  await cloudRunDeploy(
    skeetConfig.api.projectId,
    skeetConfig.api.appName,
    skeetConfig.api.region,
    workerConf.cloudRun.memory,
    String(workerConf.cloudRun.cpu),
    String(workerConf.cloudRun.maxInstances),
    String(workerConf.cloudRun.minInstances),
    pluginName,
    isWorkerPlugin
  )
  Logger.success(`Successfully created ${workerName}!`)
}
