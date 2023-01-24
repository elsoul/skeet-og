import { execCmd } from '@/lib/execCmd'
import path from 'path'

export const dbInit = async () => {
  const currentDirArray = process.cwd().split('/')
  const currentDir = currentDirArray[currentDirArray.length - 1]
  const apiDir = path.join(currentDir, '/apps/api')
  const prismaMigrateCmd = ['npx', 'prisma', 'migrate', 'dev']
  await execCmd(prismaMigrateCmd, apiDir)
}
