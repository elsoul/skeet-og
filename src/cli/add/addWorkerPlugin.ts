import { Logger } from '@/lib/logger'
import fs from 'fs'
import { execSyncCmd } from '@/lib/execSyncCmd'
import { importConfig } from '@/index'
import {
  WORKER_SOLANA_TRANSFER_REPO_URL,
  WORKER_PATH,
} from '@/lib/getNetworkConfig'
import {
  workerDeploy,
  setupActions,
  addWorkerEnv,
  updateSkeetCloudConfig,
  addWorkerToPackageJson,
} from '@/cli'

export enum WorkerPlugins {
  SOLANA_TRANSFER = 'solana-transfer',
}

export const isWorkerPlugin = async (workerName: WorkerPlugins) => {
  if (!Object.values(WorkerPlugins)?.includes(workerName)) {
    return false
  }
  return true
}

export const addWorkerPlugin = async (pluginName: string) => {
  const skeetConfig = await importConfig()
  const workerName = pluginName
  const workerDir = './apps/workers/' + workerName

  if (fs.existsSync(workerDir)) {
    await Logger.error(`Already exist workerName: ${workerName}!`)
    return ''
  } else {
    fs.mkdir(workerDir, { recursive: true }, (err) => {
      if (err) throw err
    })
  }
  const gitCloneCmd = [
    'git',
    'clone',
    WORKER_SOLANA_TRANSFER_REPO_URL,
    workerDir,
  ]
  await execSyncCmd(gitCloneCmd)
  const rmDefaultGit = ['rm', '-rf', '.git']
  await execSyncCmd(rmDefaultGit, workerDir)
  await addWorkerEnv(workerName)
  await updateSkeetCloudConfig(workerName)
  await addWorkerToPackageJson(workerName)
  await setupActions()
  const yarnCmd = ['yarn']
  await execSyncCmd(yarnCmd, `${WORKER_PATH}/${workerName}`)
  await workerDeploy(workerName, skeetConfig)
  Logger.success(`Successfully created ${workerName}!`)
}
