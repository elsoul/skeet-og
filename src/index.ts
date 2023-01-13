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

export const add = async () => {
  const appName = process.argv[3] || '--help'
  console.log('creating skeet!')
}

export const create = async () => {
  const appName = process.argv[3] || ''
  await Skeet.cloneRepo(appName)
}

export const db = async () => {
  await Skeet.runServer()
}

export const s = async () => {
  await Skeet.runServer()
}

export const sh = async () => {
  const command = process.argv[3] || '--help'
  console.log('run sh')
}

async function main() {
  try {
    program.command('run').action(run)
    program.command('create').action(create)
    program.command('add').action(add)
    program.command('s').action(s)
    await program.parseAsync(process.argv)
  } catch (error) {
    console.log(error)
  }
}

main()
