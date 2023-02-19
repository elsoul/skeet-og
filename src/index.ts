import Dotenv from 'dotenv'
import { Command } from 'commander'
import { VERSION } from '@/lib/version'
import * as Skeet from '@/cli'
import fs from 'fs'
import { toUpperCase } from '@/lib/strLib'
import { API_ENV_PRODUCTION_PATH, genSecret } from '@/lib/getNetworkConfig'
import { getModelCols } from './lib/getModelInfo'
import { syncType } from './cli/sync/syncType'

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
  workers?: Array<WorkerConfig>
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
  cloudRun: CloudRunConfig
  db: DbConfig
}

export type WorkerConfig = {
  workerName: string
  cloudRun: CloudRunConfig
}

export type CloudRunConfig = {
  cpu: string
  memory: string
  minInstances: number
  maxInstances: number
}

const program = new Command()

program
  .name('skeet')
  .description('CLI to Skeet TypeScript Serverless Framework')
  .version(VERSION)

Dotenv.config()

async function run() {
  try {
    // console.log(enumCols)
  } catch (error) {
    console.log(`error: ${error}`)
  }
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

    const add = program.command('add')
    add
      .command('worker')
      .argument('<workerName>', 'Worker Name - e.g. TwitterApi')
      .action(async (workerName: string) => {
        await Skeet.addWorker(workerName)
      })

    const gen = program.command('g').alias('generate')
    gen.command('scaffold').action(async () => {
      await Skeet.genScaffoldAll()
    })

    gen.command('iam').action(async () => {
      const skeetCloudConfig: SkeetCloudConfig = await importConfig()
      await Skeet.createServiceAccountKey(
        skeetCloudConfig.api.projectId,
        skeetCloudConfig.api.appName
      )
    })

    const d = program.command('d').alias('delete')
    d.command('scaffold')
      .argument('<modelName>', 'Model Name - e.g. User')
      .action(async (modelName: string) => {
        const modelNameUpper = await toUpperCase(modelName)
        await Skeet.deleteDir(modelNameUpper)
      })

    const run = program.command('run')
    run
      .command('list')
      .description('Google Cloud Run List')
      .action(async () => {
        const skeetCloudConfig: SkeetCloudConfig = await importConfig()
        await Skeet.runList(skeetCloudConfig.api.projectId)
      })

    const api = program.command('api')
    api.command('build').action(async () => {
      const skeetCloudConfig: SkeetCloudConfig = await importConfig()
      await Skeet.apiBuild(skeetCloudConfig.api.appName)
    })

    api.command('push').action(async () => {
      const skeetCloudConfig: SkeetCloudConfig = await importConfig()
      await Skeet.apiTag(
        skeetCloudConfig.api.projectId,
        skeetCloudConfig.api.appName,
        skeetCloudConfig.api.region
      )
      await Skeet.apiPush(
        skeetCloudConfig.api.projectId,
        skeetCloudConfig.api.appName,
        skeetCloudConfig.api.region
      )
    })
    api.command('deploy').action(async () => {
      const skeetCloudConfig: SkeetCloudConfig = await importConfig()
      await Skeet.runApiDeploy(
        skeetCloudConfig.api.projectId,
        skeetCloudConfig.api.appName,
        skeetCloudConfig.api.region,
        skeetCloudConfig.api.cloudRun.memory,
        skeetCloudConfig.api.cloudRun.cpu
      )
    })
    api.command('test').action(async () => {
      await Skeet.apiTest()
    })
    api.command('yarn').action(async () => {
      await Skeet.apiYarn()
    })
    api.command('yarn:build').action(async () => {
      await Skeet.apiYarnBuild()
    })
    api.command('yarn:start').action(async () => {
      await Skeet.apiYarnStart()
    })

    const git = program.command('git')
    git
      .command('create')
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
    git.command('init').action(Skeet.gitInit)
    git.command('git:env').action(async () => {
      await Skeet.addEnvSync(API_ENV_PRODUCTION_PATH)
    })
    git.command('env:json').action(Skeet.addJsonEnv)

    const db = program.command('db')
    db.command('generate').action(Skeet.dbGen)
    db.command('migrate')
      .option('--production', 'Migrate Production Schema')
      .argument('<migrationName>', 'Migration Name - e.g. addUserCol')
      .action(async (migrationName: string = 'init', options) => {
        const env = options.production || false
        await Skeet.dbInit(migrationName, env)
      })
    db.command('deploy')
      .option('--production', 'Migrate Production Schema')
      .action(async (options) => {
        const production = options.production || false
        await Skeet.dbMigrate(production)
      })
    db.command('reset').action(Skeet.dbReset)

    const sql = program.command('sql')
    sql.command('create').action(async () => {
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
    sql.command('start').action(sqlStart)
    sql.command('stop').action(sqlStop)
    sql.command('list').action(sqlList)
    sql.command('ip').action(sqlIp)

    const setup = program.command('setup')
    setup.command('init').action(Skeet.setup)
    setup.command('iam').action(Skeet.setupIam)
    setup.command('network').action(Skeet.setupNetwork)
    setup.command('actions').action(async () => {
      await Skeet.setupActions()
    })

    const sync = program.command('sync')
    sync.command('type').action(Skeet.syncType)

    await program.parseAsync(process.argv)
  } catch (error) {
    console.log(error)
  }
}

main()
