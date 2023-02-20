import { execSyncCmd } from '@/lib/execSyncCmd'
import { Logger } from '@/lib/logger'
import { sleep } from '@/utils/time'
import { execSync } from 'child_process'

export const psql = async () => {
  const isNetworkReady = await hasSkeetNetwork()
  if (!isNetworkReady) {
    const createNetworkCmd = ['docker', 'network', 'create', 'skeet-network']
    await execSyncCmd(createNetworkCmd)
    await sleep(500)
  }
  const psqlCmd = [
    'docker',
    'run',
    '--restart',
    'always',
    '-d',
    '--name',
    'skeet-psql',
    '--network',
    'skeet-network',
    '-p',
    '5432:5432',
    '-v',
    'postres-tmp:/home/postgresql/data',
    '-e',
    'POSTGRES_USER=skeeter',
    '-e',
    'POSTGRES_PASSWORD=rabbit',
    '-e',
    'POSTGRES_DB=skeet-api-dev',
    'postgres:14-alpine',
  ]
  await execSyncCmd(psqlCmd)
  await Logger.success('docker psql container is up!')
}

export const hasSkeetNetwork = async () => {
  const cmd = `docker network ls | grep skeet-network | awk '{print $2}'`
  const res = execSync(cmd)
  const skeetNetwork = String(res).replace(/\r?\n/g, '')
  return skeetNetwork === 'skeet-network'
}
