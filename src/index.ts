import Dotenv from 'dotenv'
import { Command } from 'commander'
import { version } from './lib/version.json'
import * as Skeet from './cli'

const program = new Command()

program
  .name('skeet')
  .description('CLI to Skeet TypeScript Serverless Framework')
  .version(version)

Dotenv.config()

async function run() {
  console.log('running skeet!')
}

export const deploy = async () => {
  await Skeet.deploy()
}

export const create = async () => {
  const appName = process.argv[3] || ''
  await Skeet.cloneRepo(appName)
}

export const migrate = async () => {
  await Skeet.migrate()
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
    program.command('deploy').action(deploy)
    program.command('test').action(test)
    await program.parseAsync(process.argv)
  } catch (error) {
    console.log(error)
  }
}

main()
