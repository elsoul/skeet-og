import inquirer from 'inquirer'
import { Logger } from '@/lib/logger'
import {
  API_ENV_PRODUCTION_PATH,
  getNetworkConfig,
} from '@/lib/getNetworkConfig'
import { importConfig } from '@/index'
import percentEncode from '@stdlib/string-percent-encode'
import {
  initArmor,
  cloudRunBuild,
  cloudRunDeploy,
  cloudRunPush,
  cloudRunTag,
  createSQL,
  generateEnvBuild,
  generateEnvProduction,
  getDatabaseIp,
  patchSQL,
  setupGcp,
  setupLoadBalancer,
  setGcloudProject,
  gitInit,
  gitCryptInit,
  gitCommit,
  createGitRepo,
  setupActions,
  addEnvSync,
} from '@/cli'
import { SkeetCloudConfig } from '@/types/skeetTypes'

const requireLetterAndNumber = (value: string) => {
  if (/\w/.test(value) && /\d/.test(value)) {
    return true
  }

  return 'Password need to have at least a letter and a number'
}

const questions = [
  {
    type: 'input',
    name: 'githubRepo',
    message: "What's your GitHub Repo Name",
    default() {
      return 'elsoul/skeet'
    },
  },
  {
    type: 'password',
    message: 'Enter your CloudSQL password',
    name: 'password1',
    mask: '*',
    validate: requireLetterAndNumber,
  },
  {
    type: 'password',
    message: 'Confirm your password',
    name: 'password2',
    mask: '*',
    validate: requireLetterAndNumber,
  },
  {
    type: 'input',
    name: 'domain',
    message: "What's domain address",
    default() {
      return 'skeet.dev'
    },
  },
]

export const init = async () => {
  inquirer.prompt(questions).then(async (answers) => {
    const answersJson = JSON.parse(JSON.stringify(answers))
    if (answersJson.password1 !== answersJson.password2)
      throw new Error("password doesn't match!")
    console.log(JSON.stringify(answers, null, '  '))
    const skeetCloudConfig = await importConfig()
    await Logger.sync(`setting up your google cloud platform...`)
    await setGcloudProject(skeetCloudConfig.api.projectId)
    await gitInit()
    await gitCryptInit()
    await gitCommit()
    await createGitRepo(answersJson.repoName)
    await setupGcp(skeetCloudConfig)
    await createCloudSQL(skeetCloudConfig, answersJson.password1)
    await addEnvSync(API_ENV_PRODUCTION_PATH)
    await setupActions()
    await apiRunDeploy(skeetCloudConfig)
    await setupLoadBalancer(skeetCloudConfig, answersJson.domain)
    await initArmor(
      skeetCloudConfig.api.projectId,
      skeetCloudConfig.api.appName
    )
  })
}

export const createCloudSQL = async (
  skeetCloudConfig: SkeetCloudConfig,
  password: string
) => {
  const { networkName } = await getNetworkConfig(
    skeetCloudConfig.api.projectId,
    skeetCloudConfig.api.appName
  )
  await createSQL(
    skeetCloudConfig.api.projectId,
    skeetCloudConfig.api.appName,
    skeetCloudConfig.api.region,
    password,
    skeetCloudConfig.api.db.databaseVersion,
    String(skeetCloudConfig.api.db.cpu),
    skeetCloudConfig.api.db.memory
  )
  const encodedPassword = percentEncode(password)
  const databaseIp = await getDatabaseIp(
    skeetCloudConfig.api.projectId,
    skeetCloudConfig.api.appName
  )
  await generateEnvBuild(
    skeetCloudConfig.api.appName,
    databaseIp,
    encodedPassword
  )

  await patchSQL(
    skeetCloudConfig.api.projectId,
    skeetCloudConfig.api.appName,
    '',
    '',
    networkName
  )
  const databasePrivateIp = await getDatabaseIp(
    skeetCloudConfig.api.projectId,
    skeetCloudConfig.api.appName,
    true
  )
  await generateEnvProduction(
    skeetCloudConfig.api.projectId,
    skeetCloudConfig.api.appName,
    skeetCloudConfig.api.region,
    databasePrivateIp,
    encodedPassword
  )
}

export const apiRunDeploy = async (skeetCloudConfig: SkeetCloudConfig) => {
  await cloudRunBuild(skeetCloudConfig.api.appName)
  await cloudRunTag(
    skeetCloudConfig.api.projectId,
    skeetCloudConfig.api.appName,
    skeetCloudConfig.api.region
  )
  await cloudRunPush(
    skeetCloudConfig.api.projectId,
    skeetCloudConfig.api.appName,
    skeetCloudConfig.api.region
  )
  await cloudRunDeploy(
    skeetCloudConfig.api.projectId,
    skeetCloudConfig.api.appName,
    skeetCloudConfig.api.region,
    skeetCloudConfig.api.cloudRun.memory,
    String(skeetCloudConfig.api.cloudRun.cpu),
    String(skeetCloudConfig.api.cloudRun.maxInstances),
    String(skeetCloudConfig.api.cloudRun.minInstances)
  )
}
