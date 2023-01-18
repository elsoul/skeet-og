import Dotenv from 'dotenv'
import { Command } from 'commander'
import { version } from './lib/version.json'
import * as Skeet from './cli'
import { Logger } from './lib/logger'
import path from 'path'
import fs from 'fs'
const program = new Command()

program
  .name('skeet')
  .description('CLI to Skeet TypeScript Serverless Framework')
  .version(version)

Dotenv.config()

async function run() {
  const currentDirArray = process.cwd().split('/')
  const currentDir = currentDirArray[currentDirArray.length - 1]
  console.log(currentDirArray[currentDirArray.length - 1])
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

export const setup = async () => {}

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
    program.command('test').action(test)
    await program.parseAsync(process.argv)
  } catch (error) {
    console.log(error)
  }
}

main()
