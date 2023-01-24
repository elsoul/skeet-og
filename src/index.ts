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
  try {
    await Skeet.addEnvSync('.env.production')
  } catch (error) {
    console.log(`error: ${error}`)
  }
}

export const deploy = async () => {}

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
    program
      .command('server')
      .description('Run Skeet API Server')
      .alias('s')
      .action(s)
    program.command('setup').action(Skeet.setup)
    program.command('run').action(run)
    program.command('deploy').action(deploy)
    program.command('db:migrate').action(Skeet.dbMigrate)
    program.command('db:gen').action(Skeet.dbGen)
    program.command('db:init').action(Skeet.dbInit)

    program.command('sql:create').action(async () => {
      const skeetCloudConfig: SkeetCloudConfig = await importConfig()
      await Skeet.runSqlCreate(
        skeetCloudConfig.api.projectId,
        skeetCloudConfig.api.appName,
        skeetCloudConfig.api.region,
        skeetCloudConfig.api.db.databaseVersion,
        skeetCloudConfig.api.db.cpu,
        skeetCloudConfig.api.db.memory
      )
    })

    program.command('sql:user').action(async () => {
      const skeetCloudConfig: SkeetCloudConfig = await importConfig()
      await Skeet.runSqlUserCreate(
        skeetCloudConfig.api.projectId,
        skeetCloudConfig.api.appName
      )
    })

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
      await Skeet.runApiDeploy(
        skeetCloudConfig.api.projectId,
        skeetCloudConfig.api.appName,
        skeetCloudConfig.api.region,
        skeetCloudConfig.api.memory,
        skeetCloudConfig.api.cpu
      )
    })

    program.command('api:yarn').action(async () => {
      await Skeet.apiYarn()
    })

    program.command('api:yarn:build').action(async () => {
      await Skeet.apiYarnBuild()
    })

    program.command('api:yarn:start').action(async () => {
      await Skeet.apiYarnStart()
    })

    program.command('git:env').action(async () => {
      await Skeet.addEnvSync('./apps/api/.env.production')
    })

    program.command('git:init').action(Skeet.gitInit)

    program.command('setup:iam').action(Skeet.setupIam)
    program.command('setup:network').action(Skeet.setupNetwork)

    program
      .command('git:create')
      .description('Create GitHub Repository')
      .argument(
        '<repoPath>',
        `example: 
            $ skeet git:create elsoul/skeet`
      )
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
