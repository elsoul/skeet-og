import Dotenv from 'dotenv'
import { Command } from 'commander'
import { version } from './lib/version.json'
import * as Skeet from './cli'
import { skeetCloudConfig } from '../skeet-cloud.config'

export type skeetCloudConfigType = {
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

const projectId = skeetCloudConfig.api.projectId || ''
const appName = skeetCloudConfig.api.appName || ''
const region = skeetCloudConfig.api.region || ''
const dbPassword = skeetCloudConfig.api.db.dbPassword || ''
const databaseVersion = skeetCloudConfig.api.db.databaseVersion || ''
const cpu = skeetCloudConfig.api.db.cpu || ''
const memory = skeetCloudConfig.api.db.memory || ''
const ips = skeetCloudConfig.api.db.whiteList

const program = new Command()

program
  .name('skeet')
  .description('CLI to Skeet TypeScript Serverless Framework')
  .version(version)

Dotenv.config()

async function run() {
  await Skeet.getContainerRegion(region)
}

export const deploy = async () => {}

export const create = async (initAppName: string) => {
  await Skeet.init(initAppName)
}

export const migrate = async () => {
  await Skeet.dbMigrate()
}

async function setupIam() {
  await Skeet.runEnableAllPermission(projectId)
  await Skeet.runAddAllRole(projectId, appName)
}

export const sqlCreate = async () => {
  await Skeet.createSQL(
    projectId,
    appName,
    region,
    dbPassword,
    databaseVersion,
    cpu,
    memory
  )
}

export const sqlStop = async () => {
  await Skeet.patchSQL(projectId, appName, 'NEVER')
}

export const sqlStart = async () => {
  await Skeet.patchSQL(projectId, appName, 'always')
}

export const sqlList = async () => {
  await Skeet.listSQL(projectId)
}

export const sqlIp = async () => {
  await Skeet.patchSQL(projectId, appName, '', ips)
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
        await create(initAppName)
      })
    program.command('migrate').action(migrate)
    program.command('server').alias('s').action(s)
    program.command('setup').action(setupIam)
    program.command('run').action(run)
    program.command('deploy').action(deploy)
    program.command('db:migrate').action(migrate)
    program.command('sql:create').action(sqlCreate)
    program.command('sql:stop').action(sqlStop)
    program.command('sql:start').action(sqlStart)
    program.command('sql:list').action(sqlList)
    program.command('sql:ip').action(sqlIp)

    program.command('api:build').action(async () => {
      await Skeet.apiBuild(appName)
    })
    program.command('api:tag').action(async () => {
      await Skeet.apiTag(projectId, appName, region)
    })
    program.command('api:push').action(async () => {
      await Skeet.apiPush(projectId, appName, region)
    })
    program.command('api:deploy').action(async () => {
      await Skeet.apiDeploy(projectId, appName, region, memory, cpu)
    })
    program.command('test').action(test)
    await program.parseAsync(process.argv)
  } catch (error) {
    console.log(error)
  }
}

main()
