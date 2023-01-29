import { exec } from 'node:child_process'
import { getContainerRegion } from '@/lib/getNetworkConfig'
import { SkeetCloudConfig, importConfig } from '@/index'

export const dockerLogin = async () => {
  const skeetCloudConfig: SkeetCloudConfig = await importConfig()
  const region = skeetCloudConfig.api.region
  const cRegion = await getContainerRegion(region)
  const shCmd = `cat ./keyfile.json | docker login -u _json_key --password-stdin https://${cRegion}`
  exec(shCmd)
}
