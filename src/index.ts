import Dotenv from 'dotenv'
import { Command } from 'commander'
import { VERSION } from '@/lib/version'
import * as Skeet from '@/cli'
import fs from 'fs'
import { toUpperCase } from '@/lib/strLib'
import { genSecret } from '@/lib/getNetworkConfig'
import { getModelCols } from './lib/getModelInfo'

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
    const enumCols = await Skeet.createInputArgs('User')
    // console.log(await Skeet.enumImport(enumCols))
    console.log(enumCols)
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
    program
      .command('add:worker')
      .argument('<workerName>', 'Worker Name - e.g. TwitterApi')
      .action(async (workerName: string) => {
        await Skeet.addWorker(workerName)
      })
    program.command('run').action(run)
    program
      .command('db:migrate')
      .option('--production', 'Migrate Production Schema')
      .action(async (options) => {
        const production = options.production || false
        await Skeet.dbMigrate(production)
      })
    program.command('db:reset').action(Skeet.dbReset)
    program.command('db:gen').action(Skeet.dbGen)
    program
      .command('db:init')
      .option('--production', 'Migrate Production Schema')
      .argument('<migrationName>', 'Migration Name - e.g. addUserCol')
      .action(async (migrationName: string = 'init', options) => {
        const env = options.production || false
        await Skeet.dbInit(migrationName, env)
      })

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

    program.command('api:test').action(async () => {
      await Skeet.apiTest()
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

    program
      .command('gen:scaffold')
      .alias('g:scaffold')
      .action(async () => {
        await Skeet.genScaffoldAll()
      })

    program
      .command('delete:scaffold')
      .alias('d:scaffold')
      .argument('<modelName>', 'Model Name - e.g. User')
      .action(async (modelName: string) => {
        const modelNameUpper = await toUpperCase(modelName)
        await Skeet.deleteDir(modelNameUpper)
      })

    program.command('git:init').action(Skeet.gitInit)
    program.command('git:env:json').action(Skeet.addJsonEnv)
    program.command('export:iam').action(async () => {
      const skeetCloudConfig: SkeetCloudConfig = await importConfig()
      await Skeet.createServiceAccountKey(
        skeetCloudConfig.api.projectId,
        skeetCloudConfig.api.appName
      )
    })

    program.command('setup:iam').action(Skeet.setupIam)
    program.command('setup:network').action(Skeet.setupNetwork)
    program.command('setup:actions').action(async () => {
      const skeetCloudConfig: SkeetCloudConfig = await importConfig()
      await Skeet.setupActions(
        skeetCloudConfig.api.memory,
        skeetCloudConfig.api.cpu
      )
    })

    program
      .command('run:list')
      .description('Google Cloud Run List')
      .action(async () => {
        const skeetCloudConfig: SkeetCloudConfig = await importConfig()
        await Skeet.runList(skeetCloudConfig.api.projectId)
      })

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
