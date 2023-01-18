import { Logger } from '../lib/logger'
import fs from 'fs'
import path from 'path'
import { execCmd } from '../lib/execCmd'
import * as fileDataOf from './templates/init'

export const init = async (appName: string) => {
  const appDir = await createApiDir(appName)
  const gitCloneCmd = ['gh', 'repo', 'clone', 'elsoul/skeet-api', appDir]
  await execCmd(gitCloneCmd)
  const yarnCmd = ['yarn']
  await execCmd(yarnCmd, appDir)
  const rmDefaultGit = ['rm', '-rf', '.git']
  await execCmd(rmDefaultGit, appDir)
  await generateInitFiles(appName)
  const createNetworkCmd = ['docker', 'network', 'create', 'skeet-network']
  await execCmd(createNetworkCmd)
  await runPsql()
  await new Promise((r) => setTimeout(r, 2000))
  await initDbMigrate(appDir)
  await Logger.skeetAA()
  await Logger.welcomText(appName)
  const nmb = Math.floor(Math.random() * 5)
  if (nmb === 5) {
    await Logger.cmText()
  }
}

export const createApiDir = async (appName: string) => {
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

export const generateInitFiles = async (appName: string) => {
  const apiDir = path.join(appName, '/apps/api')
  const packageJson = await fileDataOf.packageJson(appName)
  fs.writeFileSync(
    packageJson.filePath,
    JSON.stringify(packageJson.body, null, 2)
  )

  const tsconfigJson = await fileDataOf.tsconfigJson(appName)
  fs.writeFileSync(
    tsconfigJson.filePath,
    JSON.stringify(tsconfigJson.body, null, 2)
  )
  const eslintrcJson = await fileDataOf.eslintrcJson(appName)
  fs.writeFileSync(
    eslintrcJson.filePath,
    JSON.stringify(eslintrcJson.body, null, 2)
  )

  const eslintignore = await fileDataOf.eslintignore(appName)
  fs.writeFileSync(eslintignore.filePath, eslintignore.body)
  const prettierrc = await fileDataOf.prettierrc(appName)
  fs.writeFileSync(
    prettierrc.filePath,
    JSON.stringify(prettierrc.body, null, 2)
  )
  const skeetCloudConfigGen = await fileDataOf.skeetCloudConfigGen(appName)
  fs.writeFileSync(skeetCloudConfigGen.filePath, skeetCloudConfigGen.body)
  const prettierignore = await fileDataOf.prettierignore(appName)
  fs.writeFileSync(prettierignore.filePath, prettierignore.body)
  const gitignore = await fileDataOf.gitignore(appName)
  fs.writeFileSync(gitignore.filePath, gitignore.body)
  const rmDefaultEnv = ['rm', '.env']
  await execCmd(rmDefaultEnv, apiDir)
  const apiEnv = await fileDataOf.apiEnv(appName)
  fs.writeFileSync(apiEnv.filePath, apiEnv.body)
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
  await execCmd(cmdLine)
}

export const runPsql = async () => {
  const runPsqlCmd = [
    'docker',
    'run',
    '--restart',
    'always',
    '-d',
    '--name',
    'skeet-psql',
    '--network',
    'skeet-network',
    '-p',
    '5432:5432',
    '-v',
    'postres-tmp:/home/postgresql/data',
    '-e',
    'POSTGRES_USER=postgres',
    '-e',
    'POSTGRES_PASSWORD=postgres',
    '-e',
    'POSTGRES_DB=skeet-api-dev',
    'postgres:14-alpine',
  ]
  await execCmd(runPsqlCmd)
  console.log('docker psql container is up!')
}

export const initDbMigrate = async (apiDir: string) => {
  const prismaMigrateCmd = ['npx', 'prisma', 'migrate', 'dev', '--name', 'init']
  await execCmd(prismaMigrateCmd, apiDir)
}
