import { execSyncCmd } from '@/lib/execSyncCmd'
import { getNetworkConfig } from '@/lib/getNetworkConfig'
import { CloudArmor, SecurityPolicy } from '@/types/skeetTypes'

export enum ArmorAction {
  ALLOW = 'allow',
  DENY1 = 'deny-403',
  DENY2 = 'deny-404',
  DENY3 = 'deny-429',
  DENY4 = 'deny-502',
  REDIRECT = 'redirect',
}

export const createSecurityPolicy = async (
  projectId: string,
  appName: string
) => {
  const appConf = await getNetworkConfig(projectId, appName)
  const shCmd = [
    'gcloud',
    'compute',
    'security-policies',
    'create',
    appConf.securityPolicyName,
    '--description',
    'policy for external users',
    '--project',
    projectId,
  ]
  await execSyncCmd(shCmd)
}

export const updateBackendSecurityPolicy = async (
  projectId: string,
  appName: string
) => {
  const appConf = await getNetworkConfig(projectId, appName)
  const shCmd = [
    'gcloud',
    'compute',
    'backend-services',
    'update',
    appConf.backendServiceName,
    '--security-policy',
    appConf.securityPolicyName,
    '--project',
    projectId,
  ]
  await execSyncCmd(shCmd)
}

export const createSecurityPolicyRule = async (
  projectId: string,
  appName: string,
  description: string = 'description',
  priority: string = '1000',
  options: { [key: string]: string } = {}
) => {
  const appConf = await getNetworkConfig(projectId, appName)
  const shCmd = [
    'gcloud',
    'compute',
    'security-policies',
    'rules',
    'create',
    priority,
    '--security-policy',
    appConf.securityPolicyName,
    '--description',
    description,
    '--project',
    projectId,
  ]
  if (Object.keys(options).length !== 0) {
    for await (const [key, value] of Object.entries(options)) {
      shCmd.push(`--${key}=${value}`)
    }
  }
  await execSyncCmd(shCmd)
}

export const updateSecurityPolicyRule = async (
  projectId: string,
  appName: string,
  priority: string = '1000',
  options: { [key: string]: string } = {}
) => {
  const appConf = await getNetworkConfig(projectId, appName)
  const shCmd = [
    'gcloud',
    'compute',
    'security-policies',
    'rules',
    'update',
    priority,
    '--security-policy',
    appConf.securityPolicyName,
    '--project',
    projectId,
  ]
  if (Object.keys(options).length !== 0) {
    for await (const [key, value] of Object.entries(options)) {
      shCmd.push(`--${key}=${value}`)
    }
  }
  await execSyncCmd(shCmd)
}

export const deleteSecurityPolicyRule = async (
  projectId: string,
  appName: string,
  priority: string = '1000'
) => {
  const appConf = await getNetworkConfig(projectId, appName)
  const shCmd = [
    'gcloud',
    'compute',
    'security-policies',
    'rules',
    'delete',
    priority,
    '--security-policy',
    appConf.securityPolicyName,
    '--project',
    projectId,
  ]
  await execSyncCmd(shCmd)
}
