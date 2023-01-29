import { exec } from 'node:child_process'

export const addJsonEnv = async () => {
  const filePath = './keyfile.json'
  const cmdLine = `gh secret set SKEET_GCP_SA_KEY < ${filePath}`
  exec(cmdLine)
}
