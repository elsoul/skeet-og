import { spawn } from 'child_process'

export const runServer = async () => {
  const childProcess = spawn('yarn', ['dev'])

  childProcess.stdout.on('data', (chunk) => {
    console.log(chunk.toString())
  })
}
