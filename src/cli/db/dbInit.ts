import { execCmd } from '@/lib/execCmd'
import { API_PATH } from '@/lib/getNetworkConfig'
import path from 'path'

export const dbInit = async (name: string) => {
  const prismaMigrateCmd = ['npx', 'prisma', 'migrate', 'dev', '--name', name]
  await execCmd(prismaMigrateCmd, API_PATH)
}
