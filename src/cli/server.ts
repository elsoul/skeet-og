import { exec } from 'node:child_process'

export const runServer = async () =>
  exec(`yarn dev`, (err, output) => {
    if (err) {
      console.error('could not execute command: ', err)
      return
    }
    return true
  })
