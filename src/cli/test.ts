import { spawn } from 'child_process'

export const test = async () => {
  const childProcess = spawn('yarn', ['test'])

  childProcess.stdout.on('data', (chunk) => {
    console.log(chunk.toString())
  })
}
