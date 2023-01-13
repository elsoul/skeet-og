import { spawn } from 'child_process'

export const migrate = async () => {
  const childProcess = spawn('yarn', ['db:migrate'])

  childProcess.stdout.on('data', (chunk) => {
    console.log(chunk.toString())
  })
}
