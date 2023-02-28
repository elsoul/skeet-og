import { importConfig } from '@/index'
import { Logger } from '@/lib/logger'
import {
  createSecurityPolicy,
  updateBackendSecurityPolicy,
} from './createSecurityPolicy'

export const initArmor = async (projectId: string, appName: string) => {
  const skeetCloudConfig = await importConfig()
  await createSecurityPolicy(
    skeetCloudConfig.api.projectId,
    skeetCloudConfig.api.appName
  )
  await updateBackendSecurityPolicy(
    skeetCloudConfig.api.projectId,
    skeetCloudConfig.api.appName
  )
  await Logger.success(`successfully created Cloud Armor!`)
}
