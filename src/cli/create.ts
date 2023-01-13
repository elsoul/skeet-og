import { spawn } from 'node:child_process'

export const cloneRepo = async (appName: string) => {
  const childProcess = spawn('gh', [
    'repo',
    'clone',
    'elsoul/skeet-api',
    appName,
  ])

  childProcess.stdout.on('data', (chunk) => {
    console.log(chunk.toString())
  })

  console.log(await printEndroll(appName))
}

const printEndroll = async (appName: string) => {
  return `
   _____ __ __ __________________
  / ___// //_// ____/ ____/_  __/
  \\__ \\/ ,<  / __/ / __/   / /   
 ___/ / /| |/ /___/ /___  / /    
/____/_/ |_/_____/_____/ /_/

⚡⚡⚡ Buidl GraphQL API for Relay Fast ⚡⚡⚡
$ cd ${appName}
$ yarn && yarn dev
Go To : http://localhost:4200/graphql
  `
}
