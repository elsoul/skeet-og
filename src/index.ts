import Dotenv from 'dotenv'
import { Command } from 'commander'
import { VERSION } from '@/lib/version'
import * as Skeet from '@/cli'
import fs from 'fs'
import { toUpperCase } from '@/lib/strLib'
import { API_ENV_PRODUCTION_PATH } from '@/lib/getNetworkConfig'
import { hasSkeetNetwork } from './cli/docker/psql'
import { Logger } from './lib/logger'

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

async function test() {
  try {
    await Skeet.getPackageJson()
  } catch (error) {
    console.log(`error: ${error}`)
  }
}

async function main() {
  try {
    program.command('test').action(test)

    program
      .command('create')
      .description('Create Skeet App')
      .argument('<initAppName>', 'Skeet App Name')
      .action(async (initAppName) => {
        await Skeet.create(initAppName)
      })
    program
      .command('server')
      .description('Run Skeet Server')
      .alias('s')
      .action(Skeet.server)

    program
      .command('deploy')
      .description('Deploy to Google Cloud Run')
      .action(Skeet.deploy)

    program
      .command('yarn')
      .argument(
        '<yarnCmd>',
        Object.entries(Skeet.YarnCmd)
          .map(([_, value]) => value)
          .join(',')
      )
      .option('--service <serviceName>', 'Skeet Service Name', '')
      .option('-p, --p <packageName>', 'npm package name', '')
      .option('-D, --dev', 'Dependency environment', false)
      .action(async (yarnCmd: Skeet.YarnCmd, options) => {
        if (!Object.values(Skeet.YarnCmd)?.includes(yarnCmd)) {
          await Logger.error('Invalid Yarn command')
          process.exit(1)
        }
        if (yarnCmd === 'add' && options.p === '') {
          await Logger.error('You need to define package name!')
          process.exit(1)
        }
        await Skeet.yarn(
          options.service,
          yarnCmd,
          options.package,
          options.isDev
        )
      })

    const add = program.command('add').description('Add Comannd')
    add
      .command('worker')
      .argument('<workerName>', 'Worker Name - e.g. TwitterApi')
      .action(async (workerName: string) => {
        await Skeet.addWorker(workerName)
      })

    const gen = program
      .command('g')
      .alias('generate')
      .description('Generate Comannd')
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

    const d = program.command('d').alias('delete').description('Delete Comannd')
    d.command('scaffold')
      .argument('<modelName>', 'Model Name - e.g. User')
      .action(async (modelName: string) => {
        const modelNameUpper = await toUpperCase(modelName)
        await Skeet.deleteDir(modelNameUpper)
      })

    const run = program.command('run').description('Cloud Run Command')
    run
      .command('list')
      .description('Google Cloud Run List')
      .action(async () => {
        const skeetCloudConfig: SkeetCloudConfig = await importConfig()
        await Skeet.runList(skeetCloudConfig.api.projectId)
      })

    const git = program.command('git').description('GitHub Command')
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

    const db = program.command('db').description('DB Command')
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

    const sql = program.command('sql').description('CloudSQL Comannd')
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
    sql.command('start').action(Skeet.sqlStart)
    sql.command('stop').action(Skeet.sqlStop)
    sql.command('list').action(Skeet.sqlList)
    sql.command('ip').action(Skeet.sqlIp)

    const setup = program.command('setup').description('Setup Command')
    setup.command('init').action(Skeet.setup)
    setup.command('iam').action(Skeet.setupIam)
    setup.command('network').action(Skeet.setupNetwork)
    setup.command('actions').action(async () => {
      await Skeet.setupActions()
    })

    const sync = program.command('sync').description('Sync Command')
    sync.command('type').action(Skeet.syncType)

    const docker = program.command('docker').description('Docker Command')
    docker.command('psql').action(Skeet.psql)

    await program.parseAsync(process.argv)
  } catch (error) {
    console.log(error)
  }
}

main()
