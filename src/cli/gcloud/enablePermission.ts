import { execCmd } from '../../lib/execCmd'
import { Logger } from '../../lib/logger'

export const runEnableAllPermission = async (projectId: string) => {
  await enableServiceListPermission(projectId, serviceList)
}

export const enableServiceListPermission = async (
  projectId: string,
  serviceList: Array<string>
) => {
  serviceList.forEach(async (serviceName) => {
    await enablePermission(projectId, serviceName)
    await new Promise((r) => setTimeout(r, 1000))
    Logger.success(`added ${serviceName}!`)
  })
}

export const enablePermission = async (
  projectId: string,
  serviceName: string
) => {
  const serviceEnableCmd = [
    'gcloud',
    'services',
    'enable',
    serviceName,
    '--project',
    projectId,
  ]
  await execCmd(serviceEnableCmd)
}

export const serviceList = [
  'compute.googleapis.com',
  'iam.googleapis.com',
  'dns.googleapis.com',
  'sqladmin.googleapis.com',
  'sql-component.googleapis.com',
  'servicenetworking.googleapis.com',
  'containerregistry.googleapis.com',
  'run.googleapis.com',
  'vpcaccess.googleapis.com',
  'cloudscheduler.googleapis.com',
  'cloudresourcemanager.googleapis.com',
  'translate.googleapis.com',
  'firestore.googleapis.com',
  'cloudfunctions.googleapis.com',
  'cloudbuild.googleapis.com',
]
