import { API_TYPE_PATH, WORKER_PATH } from '@/lib/getNetworkConfig'
import { Logger } from '@/lib/logger'
import fs from 'fs'

export const syncType = async () => {
  const workers = await getWorkers()

  for await (const workerName of workers) {
    const workerTypeFilePaths = await getWorkerTypeFilePaths(workerName)
    for await (const workerTypeFilePath of workerTypeFilePaths) {
      await copyWorkerTypesToApi(workerTypeFilePath)
    }
  }
}

export const getWorkers = async () => {
  const workerDirs = fs
    .readdirSync(WORKER_PATH + '/', { withFileTypes: true })
    .filter((item) => item.isDirectory())
    .map((item) => item.name)

  return workerDirs
}

export const getWorkerTypeFilePaths = async (workerName: string) => {
  const typeDir = `${WORKER_PATH}/${workerName}/src/types/api`
  const workerTypeFilePaths = fs
    .readdirSync(typeDir, {
      withFileTypes: true,
    })
    .filter((item) => !item.isDirectory())
    .map((item) => `${typeDir}/${item.name}`)

  return workerTypeFilePaths
}

export const copyWorkerTypesToApi = async (workerTypeFilePath: string) => {
  const workerName = workerTypeFilePath.split('/')[3]
  const workerTypeFileName = workerTypeFilePath.split('/')[7]
  const workerTypeDir = `${API_TYPE_PATH}/workers/${workerName}`

  if (!fs.existsSync(workerTypeDir))
    fs.mkdirSync(workerTypeDir, { recursive: true })
  const apiTypeFilePath = `${workerTypeDir}/${workerTypeFileName}`
  fs.copyFile(workerTypeFilePath, apiTypeFilePath, (err) => {
    if (err) throw err
    Logger.success(
      `Successfully copied ${workerName} Types to API: ${workerTypeFileName}`
    )
  })
}
