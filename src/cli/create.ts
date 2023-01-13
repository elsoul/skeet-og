import { exec } from 'node:child_process'

export module Create {
  export const cloneRepo = async (appName: string) =>
    exec(`gh repo clone elsoul/skeet-api ${appName}`, (err, output) => {
      if (err) {
        console.error('could not execute command: ', err)
        return
      }
      return true
    })

  export const printEndroll = async (appName: string) => {
    const endroll = `
   _____ __ __ __________________
  / ___// //_// ____/ ____/_  __/
  \\__ \\/ ,<  / __/ / __/   / /   
 ___/ / /| |/ /___/ /___  / /    
/____/_/ |_/_____/_____/ /_/`

    const welcomText = `
⚡⚡⚡ Buidl GraphQL API for Relay Fast ⚡⚡⚡
$ cd ${appName}
$ yarn && yarn dev
Go To : http://localhost:4200/graphql
    `
    console.log(endroll)
    console.log(welcomText)
  }
}
