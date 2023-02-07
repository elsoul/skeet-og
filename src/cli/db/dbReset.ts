import { execCmd } from '@/lib/execCmd'
import { API_PATH } from '@/lib/getNetworkConfig'

export const dbReset = async () => {
  const prismaMigrateCmd = ['npx', 'prisma', 'migrate', 'reset']
  await execCmd(prismaMigrateCmd, API_PATH)
}
