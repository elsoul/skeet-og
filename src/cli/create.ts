import { Logger } from '../lib/logger'
import fs from 'fs'
import path from 'path'
import { execCmd } from '../lib/execCmd'

export const cloneRepo = async (appName: string) => {
  const appDir = await createAppDir(appName)
  const cmdLine = ['gh', 'repo', 'clone', 'elsoul/skeet-api', appDir]
  await execCmd(cmdLine)
  const yarnCmd = ['yarn']
  await execCmd(yarnCmd, appDir)
  const rmDefaultGit = ['rm', '-rf', '.git']
  await execCmd(rmDefaultGit, appDir)
  await Logger.skeetAA()
  await Logger.welcomText(appName)
  await Logger.cmText()
}

export const createAppDir = async (appName: string) => {
  try {
    const apiDir = path.join(appName, '/apps/api')
    fs.mkdir(apiDir, { recursive: true }, (err) => {
      if (err) throw err
    })
    return apiDir
  } catch (error) {
    return `error: ${error}`
  }
}

export const createGitHubRepo = async (
  repoName: string,
  openSource: boolean = false
) => {
  const publishType = openSource == true ? 'public' : 'private'

  const cmdLine = [
    'gh',
    'repo',
    'create',
    repoName,
    `--${publishType}`,
    '--push',
    '--souce=./',
    '--remote=upstream',
  ]
  execCmd(cmdLine)
}
