import { Logger } from '@/lib/logger'
import { importConfig } from '@/index'
import {
  setupActions,
  updateSkeetCloudConfig,
  getWorkerConfig,
  cloudRunDeploy,
} from '@/cli'
import {
  getContainerRegion,
  getPluginData,
  ROUTE_PACKAGE_JSON_PATH,
} from '@/lib/getNetworkConfig'
import fs from 'fs'

export const addWorkerPlugin = async (pluginName: string) => {
  const skeetConfig = await importConfig()
  const cRegion = await getContainerRegion(skeetConfig.api.region)
  const isWorkerPlugin = true
  const workerConf = await getWorkerConfig(pluginName)
  const pluginInfo = await getPluginData(pluginName)

  await updateSkeetCloudConfig(pluginName)
  await addWorkerPluginToPackageJson(
    pluginName,
    cRegion,
    String(pluginInfo.port)
  )
  await setupActions()
  await cloudRunDeploy(
    skeetConfig.api.projectId,
    skeetConfig.api.appName,
    skeetConfig.api.region,
    workerConf.cloudRun.memory,
    String(workerConf.cloudRun.cpu),
    String(workerConf.cloudRun.maxConcurrency),
    String(workerConf.cloudRun.maxInstances),
    String(workerConf.cloudRun.minInstances),
    pluginName,
    isWorkerPlugin
  )
  Logger.success(`Successfully created ${pluginName}!`)
}

export const addWorkerPluginToPackageJson = async (
  pluginName: string,
  cRegion: string,
  port: string = '1112'
) => {
  const packageJson = fs.readFileSync('./package.json')
  const newPackageJson = JSON.parse(String(packageJson))
  newPackageJson.scripts[
    `skeet:${pluginName}`
  ] = `yarn rm:${pluginName}-container && yarn run:${pluginName}`
  newPackageJson.scripts[
    `rm:${pluginName}-container`
  ] = `docker rm -f skeet-worker-${pluginName}-dev`
  newPackageJson.scripts[
    `run:${pluginName}`
  ] = `docker run -p ${port}:${port} --name skeet-worker-${pluginName}-dev --env-file apps/api/.env ${cRegion}/skeet-framework/skeet-worker-${pluginName}-dev:latest`
  fs.writeFileSync(
    ROUTE_PACKAGE_JSON_PATH,
    JSON.stringify(newPackageJson, null, 2)
  )
  Logger.success('Successfully Updated ./package.json!')
}
