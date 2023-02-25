import { Logger } from '@/lib/logger'
import fs from 'fs'
import { execSyncCmd } from '@/lib/execSyncCmd'
import { importConfig } from '@/index'
import { SkeetCloudConfig } from '@/types/skeetTypes'
import { setupActions } from '../setup'
import {
  SKEET_CONFIG_PATH,
  ROUTE_PACKAGE_JSON_PATH,
  getWorkerEnvPath,
  WORKER_REPO_URL,
} from '@/lib/getNetworkConfig'

export const addWorker = async (workerName: string) => {
  const workerDir = './apps/workers/' + workerName
  if (fs.existsSync(workerDir)) {
    await Logger.error(`Already exist workerName: ${workerName}!`)
    return ''
  } else {
    fs.mkdir(workerDir, { recursive: true }, (err) => {
      if (err) throw err
    })
  }
  const gitCloneCmd = ['git', 'clone', WORKER_REPO_URL, workerDir]
  await execSyncCmd(gitCloneCmd)
  const rmDefaultGit = ['rm', '-rf', '.git']
  await execSyncCmd(rmDefaultGit, workerDir)
  await addWorkerEnv(workerName)
  await updateSkeetCloudConfig(workerName)
  await addWorkerToPackageJson(workerName)
  await setupActions()
  Logger.success(`Successfully created ${workerName}!`)
}

export const updateSkeetCloudConfig = async (workerName: string) => {
  let skeetConfig: SkeetCloudConfig = await importConfig()
  if (skeetConfig.workers)
    skeetConfig.workers.push({
      workerName,
      cloudRun: {
        cpu: 1,
        maxConcurrency: 80,
        maxInstances: 100,
        minInstances: 0,
        memory: '1Gi',
      },
    })
  fs.writeFileSync(SKEET_CONFIG_PATH, JSON.stringify(skeetConfig, null, 2))
  Logger.success('Successfully Updated skeet-cloud.config.json!')
}

export const addWorkerToPackageJson = async (workerName: string) => {
  const packageJson = fs.readFileSync('./package.json')
  const newPackageJson = JSON.parse(String(packageJson))
  newPackageJson.scripts[
    `skeet:${workerName}`
  ] = `yarn --cwd ./apps/workers/${workerName} dev`
  fs.writeFileSync(
    ROUTE_PACKAGE_JSON_PATH,
    JSON.stringify(newPackageJson, null, 2)
  )
  Logger.success('Successfully Updated ./package.json!')
}

export const addWorkerEnv = async (workerName: string) => {
  try {
    const workerEnvPath = await getWorkerEnvPath(workerName)
    const { workers } = await importConfig()
    const port = workers ? 3000 + workers.length : 3000
    fs.writeFileSync(workerEnvPath, `\nPORT=${String(port)}`, { flag: 'a' })
  } catch (error) {
    console.log(error)
    throw new Error(JSON.stringify(String(error)))
  }
}
