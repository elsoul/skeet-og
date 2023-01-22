import { execSyncCmd } from '@/lib/execSyncCmd'
import prompt from 'prompt'
import percentEncode from '@stdlib/string-percent-encode'
import fs from 'fs'
import { Logger } from '@/lib/logger'
import { execSync } from 'child_process'

export const runSqlCreate = async (
  projectId: string,
  appName: string,
  region: string,
  databaseVersion: string,
  cpu: string,
  memory: string
) => {
  const dbPassPrompt = {
    properties: {
      password: {
        description: 'Enter DB Root Password',
        hidden: true,
        replace: '*',
      },
      passwordConfirm: {
        description: 'Confirm Password',
        hidden: true,
        replace: '*',
      },
    },
  }
  prompt.start()
  prompt.get(dbPassPrompt, async (err, result) => {
    if (result.password !== result.passwordConfirm) {
      console.log('password does not match!')
    } else {
      const password = String(result.password)
      await createSQL(
        projectId,
        appName,
        region,
        password,
        databaseVersion,
        cpu,
        memory
      )
      const encodedPassword = percentEncode(password)
      const databaseIp = await getDatabaseIp(projectId, appName)
      await generateEnvProduction(appName, databaseIp, encodedPassword)
    }
  })
}

const generateEnvProduction = async (
  appName: string,
  databaseIp: string,
  encodedPassword: string
) => {
  const filePath = './apps/api/.env.production'
  const databaseUrl = `DATABASE_URL=postgresql://postgres:${encodedPassword}@${databaseIp}:5432/skeet-${appName}-production?schema=public\n`
  const nodeSetting = 'NO_PEER_DEPENDENCY_CHECK=1\nSKEET_ENV=production'
  const envProduction = databaseUrl + nodeSetting
  fs.writeFileSync(filePath, '', { flag: 'w' })
  Logger.success('successfully exported! - ./apps/api/.env.production')
}

const getDatabaseIp = async (projectId: string, appName: string) => {
  try {
    const cmd = `gcloud sql instances list --project=${projectId} | grep ${appName} | awk '{print $5}'`
    const res = execSync(cmd)
    const databaseIp = String(res).replace(/r?n/g, '')
    return databaseIp
  } catch (error) {
    return `error: ${error}`
  }
}

export const createSQL = async (
  projectId: string,
  appName: string,
  region: string = 'europe-west4-b',
  dbPassword: string = 'postgres',
  databaseVersion: string = 'POSTGRES_14',
  cpu: string = '1',
  memory: string = '4096MB'
) => {
  const shCmd = [
    'gcloud',
    'sql',
    'instances',
    'create',
    appName,
    '--database-version',
    databaseVersion,
    '--cpu',
    cpu,
    '--memory',
    memory,
    '--region',
    region,
    '--project',
    projectId,
    '--root-password',
    dbPassword,
    '--database-flags',
    'cloudsql.iam_authentication=on',
  ]
  await execSyncCmd(shCmd)
}
