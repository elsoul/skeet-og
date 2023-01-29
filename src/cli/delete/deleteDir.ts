import { GRAPHQL_PATH } from '@/lib/getNetworkConfig'
import { Logger } from '@/lib/logger'
import fs from 'fs'

export const deleteDir = async (modelName: string) => {
  const filePath = GRAPHQL_PATH + '/' + modelName
  if (fs.existsSync(filePath)) {
    fs.rmSync(filePath, { recursive: true })
    Logger.success(`successfully deleted ✔ - ${filePath}`)
  } else {
    Logger.error(`File path doesn't exsit 🚨 - ${filePath}`)
  }
}
