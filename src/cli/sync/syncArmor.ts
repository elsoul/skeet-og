import { importConfig } from '@/index'
import { execSync } from 'child_process'
import { getNetworkConfig } from '@/lib/getNetworkConfig'
import {
  createSecurityPolicyRule,
  setGcloudProject,
  updateSecurityPolicyRule,
} from '@/cli'
import { SkeetCloudConfig } from '@/types/skeetTypes'
import { Logger } from '@/lib/logger'

export const syncArmor = async () => {
  const skeetConfig = await importConfig()
  await setGcloudProject(skeetConfig.api.projectId)
  if (skeetConfig.cloudArmor)
    for await (const rule of skeetConfig.cloudArmor[0].rules) {
      const result = await isRuleExist(skeetConfig, rule.priority)
      if (result) {
        await updateSecurityPolicyRule(
          skeetConfig.api.projectId,
          skeetConfig.api.appName,
          rule.priority,
          rule.options
        )
      } else {
        console.log('creating...')
        await createSecurityPolicyRule(
          skeetConfig.api.projectId,
          skeetConfig.api.appName,
          rule.description,
          rule.priority,
          rule.options
        )
      }
    }
  await Logger.success(`successfully updated Cloud Armor!`)
}

export const isRuleExist = async (
  skeetConfig: SkeetCloudConfig,
  priority: string
) => {
  try {
    const appConf = await getNetworkConfig(
      skeetConfig.api.projectId,
      skeetConfig.api.appName
    )
    if (skeetConfig.cloudArmor) {
      const cmd = `gcloud compute security-policies rules describe ${priority} --security-policy=${appConf.securityPolicyName} --project=${skeetConfig.api.projectId}`
      execSync(cmd, { stdio: 'ignore' })
    }
    return true
  } catch (error) {
    return false
  }
}
