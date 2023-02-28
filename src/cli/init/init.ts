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
  addIp,
  sqlIp,
  dbMigrate,
  syncRunUrl,
  syncArmor,
} from '@/cli'
import { SkeetCloudConfig } from '@/types/skeetTypes'

const requireLetterAndNumber = (value: string) => {
  if (/\w/.test(value) && /\d/.test(value)) {
    return true
  }

  return 'Password need to have at least a letter and a number'
}

const requireRepoName = (value: string) => {
  if (/.+\/.+/.test(value)) {
    return true
  }

  return 'This is not GitHub Repo Name!It must be repoOwner/repoName'
}

const requireDomainName = (value: string) => {
  if (/.+\..+/.test(value)) {
    return true
  }

  return 'This is not Domain Name!It must be example.com'
}

const questions = [
  {
    type: 'input',
    name: 'githubRepo',
    message: "What's your GitHub Repo Name",
    validate: requireRepoName,
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
    type: 'list',
    name: 'lb',
    message: 'Do you want to setup Cloud Load Balancer?',
    choices: ['Yes', 'No'],
  },
]

const domainQuestion = [
  {
    type: 'input',
    name: 'domain',
    message: "What's domain address",
    validate: requireDomainName,
    default() {
      return 'skeet.dev'
    },
  },
]

export const init = async () => {
  inquirer.prompt(questions).then(async (answers) => {
    const answersJson = JSON.parse(JSON.stringify(answers))
    const skeetCloudConfig = await importConfig()
    if (answersJson.password1 !== answersJson.password2)
      throw new Error("password doesn't match!")

    if (answersJson.lb === 'Yes') {
      inquirer.prompt(domainQuestion).then(async (answer) => {
        const domain = JSON.parse(JSON.stringify(answer)).domain
        await setupCloud(
          skeetCloudConfig,
          answersJson.githubRepo,
          answersJson.password1
        )
        await setupLoadBalancer(skeetCloudConfig, domain)
        await initArmor(
          skeetCloudConfig.api.projectId,
          skeetCloudConfig.api.appName
        )
        await syncArmor()
      })
    } else {
      await setupCloud(
        skeetCloudConfig,
        answersJson.githubRepo,
        answersJson.password1
      )
    }
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

export const setupCloud = async (
  skeetCloudConfig: SkeetCloudConfig,
  repoName: string,
  dbPass: string
) => {
  await Logger.sync(`setting up your google cloud platform...`)
  await setGcloudProject(skeetCloudConfig.api.projectId)
  await gitInit()
  await gitCryptInit()
  await gitCommit()
  await createGitRepo(repoName)
  await setupGcp(skeetCloudConfig)
  await createCloudSQL(skeetCloudConfig, dbPass)
  await addIp()
  await sqlIp()
  await dbMigrate(true)
  await addEnvSync(API_ENV_PRODUCTION_PATH)
  await setupActions()
  await apiRunDeploy(skeetCloudConfig)
  await syncRunUrl()
}
