import Dotenv from 'dotenv'
import { Command } from 'commander'
import { version } from './lib/version.json'
import * as Skeet from './cli'
import { skeetCloudConfig } from '../skeet-cloud.config'

export type skeetCloudConfigType = {
  api: GCPConfig
}

export type GCPConfig = {
  appName: string
  projectId: string
  region: string
  cpu: string
  memory: string
}

const program = new Command()

program
  .name('skeet')
  .description('CLI to Skeet TypeScript Serverless Framework')
  .version(version)

Dotenv.config()

async function run() {
  const projectId = skeetCloudConfig.api.projectId || ''
  const appName = skeetCloudConfig.api.appName || ''
  await Skeet.createServiceAccount(projectId, appName)
}

export const deploy = async () => {
  await Skeet.deploy()
}

export const create = async () => {
  const appName = process.argv[3] || ''
  await Skeet.init(appName)
}

export const migrate = async () => {
  await Skeet.dbMigrate()
}

async function setupIam() {
  const projectId = skeetCloudConfig.api.projectId || ''
  const appName = skeetCloudConfig.api.appName || ''
  //await Skeet.runEnableAllPermission(projectId)
  await Skeet.runAddAllRole(projectId, appName)
}
export const s = async () => {
  await Skeet.runServer()
}

export const test = async () => {
  await Skeet.test()
}

async function main() {
  try {
    program.command('create').action(create)
    program.command('migrate').action(migrate)
    program.command('s').action(s)
    program.command('run').action(run)
    program.command('deploy').action(deploy)
    program.command('db:migrate').action(migrate)
    program.command('setup').action(setupIam)
    program.command('test').action(test)
    await program.parseAsync(process.argv)
  } catch (error) {
    console.log(error)
  }
}

main()
