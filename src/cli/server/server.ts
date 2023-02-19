import { execCmd } from '@/lib/execCmd'
import { API_PATH, WORKER_PATH } from '@/lib/getNetworkConfig'
import { getWorkers } from '../sync'
import { Logger } from '@/lib/logger'

export const server = async () => {
  try {
    await runApiServer()
    const workers = await getWorkers()
    if (workers.length !== 0) {
      for await (const workerName of workers) {
        await runWorkerServer(workerName)
      }
    }
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
