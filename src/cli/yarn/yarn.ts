import { execSyncCmd } from '@/lib/execSyncCmd'
import inquirer from 'inquirer'
import { API_PATH, WORKER_PATH } from '@/lib/getNetworkConfig'
import { getWorkers } from '../sync'
import { importConfig } from '@/index'

export type YarnService = {
  yarn: Array<string>
}

export enum YarnCmd {
  DEV = 'dev',
  INSTALL = 'install',
  BUILD = 'build',
  START = 'start',
  ADD = 'add',
}

export const yarn = async (
  serviceName: string = '',
  yarnCmd: YarnCmd,
  packageName: string = '',
  isDev: boolean = false
) => {
  if (serviceName !== '') {
    const skeetConfig = await importConfig()
    const service =
      serviceName === 'api' ? skeetConfig.api.appName : serviceName
    await yarnCmdRun(service, yarnCmd, packageName, isDev)
    return true
  } else {
    const workers = await getWorkers()
    let workerNames = [{ name: 'api' }]
    for await (const workerName of workers) {
      workerNames.push({ name: workerName })
    }
    inquirer
      .prompt([
        {
          type: 'checkbox',
          message: 'Select Services to run yarn command',
          name: 'yarn',
          choices: [new inquirer.Separator(' = Services = '), ...workerNames],
          validate(answer) {
            if (answer.length < 1) {
              return 'You must choose at least one service.'
            }

            return true
          },
        },
      ])
      .then(async (answers: YarnService) => {
        if (answers.yarn) {
          answers.yarn.forEach(async (service) => {
            await yarnCmdRun(service, yarnCmd, packageName, isDev)
          })
        }
        return true
      })
  }
}

export const yarnCmdRun = async (
  servieName: string,
  yarnCmd: string,
  packageName: string = '',
  isDev: boolean = false
) => {
  let shCmd: Array<string> = []
  switch (yarnCmd) {
    case 'add':
      shCmd = await getYarnShCmd(servieName, yarnCmd, packageName, isDev)
      break
    default:
      shCmd = await getYarnShCmd(servieName, yarnCmd)
      break
  }
  execSyncCmd(shCmd)
}

const getYarnShCmd = async (
  servieName: string = '',
  yarnCmd: string,
  packageName: string = '',
  isDev: boolean = false
) => {
  let shCmd = []
  switch (servieName) {
    case 'api':
      shCmd = ['yarn', '--cwd', API_PATH, yarnCmd]
      break
    default:
      shCmd = ['yarn', '--cwd', `${WORKER_PATH}/${servieName}`, yarnCmd]
      break
  }
  if (packageName !== '' && isDev) {
    shCmd.push('-D', packageName)
  } else if (packageName !== '' && isDev === false) {
    shCmd.push(packageName)
  }
  return shCmd
}
