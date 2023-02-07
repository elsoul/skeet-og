import * as Skeet from '@/cli'
import { API_ENV_PRODUCTION_PATH } from '@/lib/getNetworkConfig'
import fs from 'fs'

export const setupActions = async (memory: string, cpu: string) => {
  try {
    const envString = await Skeet.getEnvString(API_ENV_PRODUCTION_PATH)
    const result = await Skeet.apiYml(envString, memory, cpu)
    fs.writeFileSync(result.filePath, result.body, { flag: 'w' })
  } catch (error) {
    console.log(`error: ${error}`)
  }
}
