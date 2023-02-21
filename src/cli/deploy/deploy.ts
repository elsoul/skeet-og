import { execSyncCmd } from '@/lib/execSyncCmd'
import inquirer from 'inquirer'
import { getWorkerConfig, getWorkers } from '@/cli'
import {
  getNetworkConfig,
  getContainerImageName,
  getContainerImageUrl,
  getBuidEnvString,
  API_PATH,
  WORKER_PATH,
} from '@/lib/getNetworkConfig'
import { importConfig } from '@/index'

export const deploy = async () => {
  const workers = await getWorkers()
  let workerNames = [{ name: 'api' }]
  for await (const workerName of workers) {
    workerNames.push({ name: workerName })
  }
  inquirer
    .prompt([
      {
        type: 'checkbox',
        message: 'Select Services to deploy',
        name: 'deploying',
        choices: [new inquirer.Separator(' = Services = '), ...workerNames],
        validate(answer) {
          if (answer.length < 1) {
            return 'You must choose at least one service.'
          }

          return true
        },
      },
    ])
    .then(async (answers) => {
      const skeetConfig = await importConfig()
      for await (const service of answers.deploying) {
        if (service === 'api') {
          await cloudRunBuild(skeetConfig.api.appName)
          await cloudRunTag(
            skeetConfig.api.projectId,
            skeetConfig.api.appName,
            skeetConfig.api.region
          )
          await cloudRunPush(
            skeetConfig.api.projectId,
            skeetConfig.api.appName,
            skeetConfig.api.region
          )
          await cloudRunDeploy(
            skeetConfig.api.projectId,
            skeetConfig.api.appName,
            skeetConfig.api.region,
            skeetConfig.api.cloudRun.memory,
            skeetConfig.api.cloudRun.cpu,
            String(skeetConfig.api.cloudRun.maxInstances),
            String(skeetConfig.api.cloudRun.minInstances)
          )
        } else {
          await cloudRunBuild(skeetConfig.api.appName, service)
          await cloudRunTag(
            skeetConfig.api.projectId,
            skeetConfig.api.appName,
            skeetConfig.api.region
          )
          await cloudRunPush(
            skeetConfig.api.projectId,
            skeetConfig.api.appName,
            skeetConfig.api.region,
            service
          )
          const workerConf = await getWorkerConfig(service)
          await cloudRunDeploy(
            skeetConfig.api.projectId,
            skeetConfig.api.appName,
            skeetConfig.api.region,
            workerConf.cloudRun.memory,
            workerConf.cloudRun.cpu,
            String(workerConf.cloudRun.maxInstances),
            String(workerConf.cloudRun.minInstances),
            service
          )
        }
      }
      console.log(JSON.stringify(answers, null, '  '))
    })
}

export const cloudRunDeploy = async (
  projectId: string,
  appName: string,
  region: string,
  memory: string = '1Gi',
  cpu: string = '1',
  maxInstances: string = '100',
  minInstances: string = '0',
  workerName: string = ''
) => {
  let cloudRunName = ''
  let image = ''
  if (workerName === '') {
    cloudRunName = await getContainerImageName(appName)
    image = await getContainerImageUrl(projectId, appName, region)
  } else {
    cloudRunName = await getContainerImageName(appName, workerName)
    image = await getContainerImageUrl(projectId, appName, region, workerName)
  }
  const { connectorName, serviceAccountName } = await getNetworkConfig(
    projectId,
    appName
  )
  const envString = await getBuidEnvString()
  const shCmd = [
    'gcloud',
    'run',
    'deploy',
    cloudRunName,
    '--service-account',
    serviceAccountName,
    '--image',
    image,
    '--memory',
    memory,
    '--cpu',
    cpu,
    '--max-instances',
    maxInstances,
    '--min-instances',
    minInstances,
    '--region',
    region,
    '--allow-unauthenticated',
    '--platform=managed',
    '--quiet',
    '--vpc-connector',
    connectorName,
    '--project',
    projectId,
    '--set-env-vars',
    envString,
  ]
  await execSyncCmd(shCmd)
}

export const cloudRunBuild = async (
  appName: string,
  workerName: string = ''
) => {
  const buildPath =
    workerName === '' ? API_PATH : `${WORKER_PATH}/${workerName}`
  const imageName = await getContainerImageName(appName)
  const shCmd = [
    'docker',
    'build',
    '-f',
    `${buildPath}/Dockerfile`,
    buildPath,
    '-t',
    imageName,
  ]
  execSyncCmd(shCmd)
}

export const cloudRunPush = async (
  projectId: string,
  appName: string,
  region: string,
  workerName: string = ''
) => {
  const imageUrl =
    workerName === ''
      ? await getContainerImageUrl(projectId, appName, region)
      : await getContainerImageUrl(projectId, appName, region, workerName)
  const shCmd = ['docker', 'push', imageUrl]
  execSyncCmd(shCmd)
}

export const cloudRunTag = async (
  projectId: string,
  appName: string,
  region: string
) => {
  const imageName = await getContainerImageName(appName)
  const imageUrl = await getContainerImageUrl(projectId, appName, region)
  const shCmd = ['docker', 'tag', imageName, imageUrl]
  execSyncCmd(shCmd)
}
