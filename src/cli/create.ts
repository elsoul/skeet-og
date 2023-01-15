import { spawn } from 'node:child_process'
import { Logger } from '../lib/logger'

export const cloneRepo = async (appName: string) => {
  const childProcess = spawn('gh', [
    'repo',
    'clone',
    'elsoul/skeet-api',
    appName,
  ])

  childProcess.stdout.on('data', (chunk) => {
    console.log(chunk.toString())
  })
  await Logger.skeetAA()
  await Logger.welcomText(appName)
  await Logger.cmText()
}
