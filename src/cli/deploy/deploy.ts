import { execSyncCmd } from '@/lib/execSyncCmd'
import inquirer from 'inquirer'
import {
  getWorkerConfig,
  getWorkersFromConfig,
  setGcloudProject,
  syncRunUrl,
} from '@/cli'
import {
  getNetworkConfig,
  getContainerImageName,
  getContainerImageUrl,
  getBuidEnvString,
  API_PATH,
  WORKER_PATH,
  isWorkerPlugin,
} from '@/lib/getNetworkConfig'
import { importConfig } from '@/index'
import { SkeetCloudConfig } from '@/types/skeetTypes'

export const deploy = async () => {
  const workers = await getWorkersFromConfig()
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
      await setGcloudProject(skeetConfig.api.projectId)
      for await (const service of answers.deploying) {
        if (service === 'api') {
          await apiDeploy(skeetConfig)
        } else {
          const isWorkerPluginBoolean = await isWorkerPlugin(service)
          isWorkerPluginBoolean
            ? await workerPluginDeploy(service, skeetConfig)
            : await workerDeploy(service, skeetConfig)
        }
      }
      await syncRunUrl()
      console.log(JSON.stringify(answers, null, '  '))
    })
}

export const cloudRunDeploy = async (
  projectId: string,
  appName: string,
  region: string,
  memory: string = '1Gi',
  cpu: string = '1',
  maxConcurrency: string = '80',
  maxInstances: string = '100',
  minInstances: string = '0',
  workerName: string = '',
  isWorkerPlugin: boolean = false,
  hasBalancer: boolean = false
) => {
  let cloudRunName = ''
  let image = ''
  if (workerName === '') {
    cloudRunName = await getContainerImageName(appName)
    image = await getContainerImageUrl(projectId, appName, region)
  } else {
    cloudRunName = await getContainerImageName(appName, workerName)
    image = await getContainerImageUrl(
      projectId,
      appName,
      region,
      workerName,
      isWorkerPlugin
    )
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
    '--concurrency',
    maxConcurrency,
    '--max-instances',
    maxInstances,
    '--min-instances',
    minInstances,
    '--region',
    region,
    '--platform=managed',
    '--quiet',
    '--vpc-connector',
    connectorName,
    '--project',
    projectId,
    '--set-env-vars',
    envString,
  ]
  if (hasBalancer && workerName === '') {
    shCmd.push('--ingress', 'internal-and-cloud-load-balancing')
  } else if (!hasBalancer && workerName === '') {
    shCmd.push('--allow-unauthenticated')
  } else {
    shCmd.push('--ingress', 'internal')
  }
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
    '--platform',
    'linux/amd64',
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

export const workerDeploy = async (
  service: string,
  skeetConfig: SkeetCloudConfig
) => {
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
    String(workerConf.cloudRun.cpu),
    String(workerConf.cloudRun.maxConcurrency),
    String(workerConf.cloudRun.maxInstances),
    String(workerConf.cloudRun.minInstances),
    service
  )
}

export const apiDeploy = async (skeetConfig: SkeetCloudConfig) => {
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
    String(skeetConfig.api.cloudRun.cpu),
    String(skeetConfig.api.cloudRun.maxConcurrency),
    String(skeetConfig.api.cloudRun.maxInstances),
    String(skeetConfig.api.cloudRun.minInstances),
    '',
    false,
    skeetConfig.api.hasLoadBalancer
  )
}

export const workerPluginDeploy = async (
  service: string,
  skeetConfig: SkeetCloudConfig
) => {
  const isWorkerPlugin = true
  const workerConf = await getWorkerConfig(service)
  await cloudRunDeploy(
    skeetConfig.api.projectId,
    skeetConfig.api.appName,
    skeetConfig.api.region,
    workerConf.cloudRun.memory,
    String(workerConf.cloudRun.cpu),
    String(workerConf.cloudRun.maxConcurrency),
    String(workerConf.cloudRun.maxInstances),
    String(workerConf.cloudRun.minInstances),
    service,
    isWorkerPlugin
  )
}
