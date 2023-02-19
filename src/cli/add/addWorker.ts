import { Logger } from '@/lib/logger'
import fs from 'fs'
import { execSyncCmd } from '@/lib/execSyncCmd'
import { SkeetCloudConfig, importConfig } from '@/index'
import { setupActions } from '../setup'

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
  const gitCloneCmd = ['gh', 'repo', 'clone', 'elsoul/skeet-worker', workerDir]
  await execSyncCmd(gitCloneCmd)
  const rmDefaultGit = ['rm', '-rf', '.git']
  await execSyncCmd(rmDefaultGit, workerDir)
  await updateSkeetCloudConfig(workerName)
  await setupActions()
  Logger.success(`Successfully created ${workerName}!`)
}

export const updateSkeetCloudConfig = async (workerName: string) => {
  let skeetConfig: SkeetCloudConfig = await importConfig()
  if (skeetConfig.workers)
    skeetConfig.workers.push({
      workerName,
      cloudRun: {
        cpu: '1',
        maxInstances: 100,
        minInstances: 0,
        memory: '1Gi',
      },
    })
  fs.writeFileSync(
    './skeet-cloud.config.json',
    JSON.stringify(skeetConfig, null, 2)
  )
  Logger.success('Successfully Updated skeet-cloud.config.json!')
}
