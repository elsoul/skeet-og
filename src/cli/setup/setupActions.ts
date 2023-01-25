import * as Skeet from '@/cli'
import fs from 'fs'

export const setupActions = async () => {
  try {
    const apiEnvPath = './apps/api/.env.production'
    const envString = await Skeet.getEnvString(apiEnvPath)
    const result = await Skeet.apiYml(envString)
    fs.writeFileSync(result.filePath, result.body, { flag: 'w' })
  } catch (error) {
    console.log(`error: ${error}`)
  }
}
