import Dotenv from 'dotenv'
import { Command } from 'commander'
import { VERSION } from '@/lib/version'
import * as Skeet from '@/cli'
import fs from 'fs'

export const importConfig = async () => {
  try {
    const config = fs.readFileSync(`${process.cwd()}/skeet-cloud.config.json`)
    const json: SkeetCloudConfig = JSON.parse(String(config))
    return json
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

export type SkeetCloudConfig = {
  api: GCPConfig
}

export type DbConfig = {
  databaseVersion: string
  dbPassword: string
  cpu: string
  memory: string
  whiteList?: string
}

export type GCPConfig = {
  appName: string
  projectId: string
  region: string
  cpu: string
  memory: string
  db: DbConfig
}

const program = new Command()

program
  .name('skeet')
  .description('CLI to Skeet TypeScript Serverless Framework')
  .version(VERSION)

Dotenv.config()

async function run() {
  const skeetCloudConfig: SkeetCloudConfig = await importConfig()
  console.log(skeetCloudConfig)
  // await Skeet.getContainerRegion(skeetCloudConfig.api.region)
}

export const deploy = async () => {}

async function setupIam() {
  const skeetCloudConfig: SkeetCloudConfig = await importConfig()
  await Skeet.runEnableAllPermission(skeetCloudConfig.api.projectId)
  await Skeet.runAddAllRole(
    skeetCloudConfig.api.projectId,
    skeetCloudConfig.api.appName
  )
}

export const sqlCreate = async () => {
  const skeetCloudConfig: SkeetCloudConfig = await importConfig()
  await Skeet.createSQL(
    skeetCloudConfig.api.projectId,
    skeetCloudConfig.api.appName,
    skeetCloudConfig.api.region,
    skeetCloudConfig.api.db.dbPassword,
    skeetCloudConfig.api.db.databaseVersion,
    skeetCloudConfig.api.db.cpu,
    skeetCloudConfig.api.db.memory
  )
}

export const sqlStop = async () => {
  const skeetCloudConfig: SkeetCloudConfig = await importConfig()
  await Skeet.patchSQL(
    skeetCloudConfig.api.projectId,
    skeetCloudConfig.api.appName,
    'NEVER'
  )
}

export const sqlStart = async () => {
  const skeetCloudConfig: SkeetCloudConfig = await importConfig()
  await Skeet.patchSQL(
    skeetCloudConfig.api.projectId,
    skeetCloudConfig.api.appName,
    'always'
  )
}

export const sqlList = async () => {
  const skeetCloudConfig: SkeetCloudConfig = await importConfig()
  await Skeet.listSQL(skeetCloudConfig.api.projectId)
}

export const sqlIp = async () => {
  const skeetCloudConfig: SkeetCloudConfig = await importConfig()
  await Skeet.patchSQL(
    skeetCloudConfig.api.projectId,
    skeetCloudConfig.api.appName,
    '',
    skeetCloudConfig.api.db.whiteList
  )
}

export const s = async () => {
  await Skeet.runServer()
}

export const test = async () => {
  await Skeet.test()
}

async function main() {
  try {
    program
      .command('create')
      .description('Create Skeet App')
      .argument('<initAppName>', 'Skeet App Name')
      .action(async (initAppName) => {
        await Skeet.create(initAppName)
      })
    program.command('server').alias('s').action(s)
    program.command('setup').action(setupIam)
    program.command('run').action(run)
    program.command('deploy').action(deploy)
    program.command('db:migrate').action(Skeet.dbMigrate)
    program.command('sql:create').action(sqlCreate)
    program.command('sql:stop').action(sqlStop)
    program.command('sql:start').action(sqlStart)
    program.command('sql:list').action(sqlList)
    program.command('sql:ip').action(sqlIp)

    program.command('api:build').action(async () => {
      const skeetCloudConfig: SkeetCloudConfig = await importConfig()
      await Skeet.apiBuild(skeetCloudConfig.api.appName)
    })
    program.command('api:tag').action(async () => {
      const skeetCloudConfig: SkeetCloudConfig = await importConfig()
      await Skeet.apiTag(
        skeetCloudConfig.api.projectId,
        skeetCloudConfig.api.appName,
        skeetCloudConfig.api.region
      )
    })
    program.command('api:push').action(async () => {
      const skeetCloudConfig: SkeetCloudConfig = await importConfig()
      await Skeet.apiPush(
        skeetCloudConfig.api.projectId,
        skeetCloudConfig.api.appName,
        skeetCloudConfig.api.region
      )
    })
    program.command('api:deploy').action(async () => {
      const skeetCloudConfig: SkeetCloudConfig = await importConfig()
      await Skeet.apiDeploy(
        skeetCloudConfig.api.projectId,
        skeetCloudConfig.api.appName,
        skeetCloudConfig.api.region,
        skeetCloudConfig.api.memory,
        skeetCloudConfig.api.cpu
      )
    })

    program.command('git:init').action(Skeet.gitInit)

    program
      .command('git:create')
      .description('Create GitHub Repository')
      .argument('<repoPath>', 'e.g. elsoul/skeet')
      .option('--public', 'Create Public Repository for OpenSouce Buidlers 🛠️')
      .action(async (repoPath, options) => {
        const openSource = options.public || false
        const repoName = repoPath || ''
        await Skeet.createGitRepo(repoName, openSource)
      })

    program.command('test').action(test)
    await program.parseAsync(process.argv)
  } catch (error) {
    console.log(error)
  }
}

main()
