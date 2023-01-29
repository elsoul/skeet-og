import { execCmd } from '@/lib/execCmd'
import { API_PATH } from '@/lib/getNetworkConfig'

export const dbGen = async () => {
  const prismaMigrateCmd = ['npx', 'prisma', 'generate']
  await execCmd(prismaMigrateCmd, API_PATH)
}
