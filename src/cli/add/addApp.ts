import { Logger } from '@/lib/logger'
import fs from 'fs'
import { execSyncCmd } from '@/lib/execSyncCmd'
import { setupActions } from '../setup'
import {
  ROUTE_PACKAGE_JSON_PATH,
  FRONT_APP_REPO_URL,
  FRONT_APP_PATH,
} from '@/lib/getNetworkConfig'
import { webYml } from '..'

export const addApp = async () => {
  if (fs.existsSync(FRONT_APP_PATH)) {
    await Logger.error(`Already exist App!`)
    return ''
  } else {
    fs.mkdir(FRONT_APP_PATH, { recursive: true }, (err) => {
      if (err) throw err
    })
  }
  const gitCloneCmd = ['git', 'clone', FRONT_APP_REPO_URL, FRONT_APP_PATH]
  await execSyncCmd(gitCloneCmd)
  const rmDefaultGit = ['rm', '-rf', '.git']
  await execSyncCmd(rmDefaultGit, FRONT_APP_PATH)
  const result = await webYml()
  fs.writeFileSync(result.filePath, result.body, { flag: 'w' })
  await addFrontAppToPackageJson()
  await setupActions()
  const yarnCmd = ['yarn']
  await execSyncCmd(yarnCmd, FRONT_APP_PATH)
  Logger.success(`Successfully created App!`)
}

export const addFrontAppToPackageJson = async () => {
  const packageJson = fs.readFileSync('./package.json')
  const newPackageJson = JSON.parse(String(packageJson))
  newPackageJson.scripts[`skeet:app`] = `yarn --cwd ${FRONT_APP_PATH} dev`
  fs.writeFileSync(
    ROUTE_PACKAGE_JSON_PATH,
    JSON.stringify(newPackageJson, null, 2)
  )
  Logger.success('Successfully Updated ./package.json!')
}
