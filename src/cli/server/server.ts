import { execCmd } from '@/lib/execCmd'
import { API_PATH, WORKER_PATH } from '@/lib/getNetworkConfig'
import { Logger } from '@/lib/logger'

export const server = async () => {
  try {
    const shCmd = ['yarn', 'skeet']
    await execCmd(shCmd)
  } catch (error) {
    await Logger.error(`error: ${error}`)
    process.exit(1)
  }
}

export const runApiServer = async () => {
  const shCmd = ['yarn', 'dev']
  await execCmd(shCmd, API_PATH)
}

export const runWorkerServer = async (workerName: string) => {
  const shCmd = ['yarn', 'dev']
  await execCmd(shCmd, `${WORKER_PATH}/${workerName}`)
}
