import { execCmd } from '@/lib/execCmd'
import { API_PATH } from '@/lib/getNetworkConfig'
import path from 'path'

export const dbInit = async (name: string, production: boolean = false) => {
  const prismaMigrateCmd = production
    ? [
        'dotenv',
        '-f',
        '.env.build',
        'npx',
        'prisma',
        'migrate',
        'dev',
        '--name',
        name,
      ]
    : ['npx', 'prisma', 'migrate', 'dev', '--name', name]
  await execCmd(prismaMigrateCmd, API_PATH)
}
