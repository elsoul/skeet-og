import { execCmd } from '@/lib/execCmd'
import { API_PATH } from '@/lib/getNetworkConfig'

export const dbMigrate = async () => {
  const prismaMigrateCmd = ['npx', 'prisma', 'migrate', 'deploy']
  await execCmd(prismaMigrateCmd, API_PATH)
}
