import { execCmd } from '@/lib/execCmd'
import { API_ENV_BUILD_PATH, API_PATH } from '@/lib/getNetworkConfig'
import dotenv from 'dotenv'
import fs from 'fs'

export const dbMigrate = async (production: boolean = false) => {
  let shCmd = []
  if (production) {
    const stream = fs.readFileSync(API_ENV_BUILD_PATH)
    const buf = Buffer.from(stream)
    const { DATABASE_URL } = dotenv.parse(buf)
    shCmd = [
      'yarn',
      '--cwd',
      API_PATH,
      'db:deploy',
      'DATABASE_URL',
      DATABASE_URL,
    ]
  } else {
    shCmd = ['yarn', '--cwd', API_PATH, 'db:deploy']
  }
  await execCmd(shCmd, API_PATH)
}
