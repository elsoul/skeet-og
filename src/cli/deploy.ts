import { spawn } from 'child_process'

export const deploy = async () => {
  const childProcess = spawn('yarn', ['deploy'])

  childProcess.stdout.on('data', (chunk) => {
    console.log(chunk.toString())
  })
}
