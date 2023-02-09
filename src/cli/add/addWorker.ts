import { Logger } from '@/lib/logger'
import fs from 'fs'
import { execSyncCmd } from '@/lib/execSyncCmd'

export const addWorker = async (workerName: string) => {
  const workerDir = './apps/workers/' + workerName
  fs.mkdir(workerDir, { recursive: true }, (err) => {
    if (err) throw err
  })
  const gitCloneCmd = ['gh', 'repo', 'clone', 'elsoul/skeet-worker', workerDir]
  await execSyncCmd(gitCloneCmd)
  Logger.success(`successfully create ${workerName}!`)
}
