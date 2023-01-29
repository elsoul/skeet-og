import { exec } from 'node:child_process'

export const addJsonEnv = async () => {
  const filePath = KEYFILE_PATH
  const cmdLine = `gh secret set SKEET_GCP_SA_KEY < ${filePath}`
  exec(cmdLine)
}
