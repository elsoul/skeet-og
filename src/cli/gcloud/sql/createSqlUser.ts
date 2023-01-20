import { execSyncCmd } from '@/lib/execSyncCmd'
import prompt from 'prompt'

export const runSqlUserCreate = async (projectId: string, appName: string) => {
  const dbPassPrompt = {
    properties: {
      userName: {
        description: 'Enter DB User Name',
        replace: '*',
      },
      password: {
        description: 'Enter DB User Password',
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
      const userName = String(result.userName)
      await createSqlUser(projectId, appName, userName, password)
    }
  })
}

export const createSqlUser = async (
  projectId: string,
  appName: string,
  userName: string,
  password: string
) => {
  const shCmd = [
    'gcloud',
    'sql',
    'users',
    'create',
    userName,
    '--instance',
    appName,
    '--password',
    password,
    '--project',
    projectId,
  ]
  await execSyncCmd(shCmd)
}
