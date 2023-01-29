import { exec } from 'node:child_process'
import { KEYFILE_PATH } from '@/lib/getNetworkConfig'

export const addJsonEnv = async () => {
  const cmdLine = `gh secret set SKEET_GCP_SA_KEY < ${KEYFILE_PATH}`
  exec(cmdLine)
}
