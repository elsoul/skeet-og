import { execCmd } from '@/lib/execCmd'
import { API_PATH } from '@/lib/getNetworkConfig'

export const dbMigrate = async (production: boolean = false) => {
  const prismaMigrateCmd = production
    ? [
        'dotenv',
        '-e',
        `${API_PATH}/.env.build`,
        'npx',
        'prisma',
        'migrate',
        'deploy',
      ]
    : ['npx', 'prisma', 'migrate', 'deploy']
  await execCmd(prismaMigrateCmd, API_PATH)
}
