import fetch from 'node-fetch'
import fs from 'fs'
import { Logger } from '@/lib/logger'
import { SKEET_CONFIG_PATH } from '@/lib/getNetworkConfig'
import { SkeetCloudConfig } from '@/types/skeetTypes'
import { importConfig } from '@/index'

export const addIp = async () => {
  const homeIp = await getHomeIp()
  await addHomeIpToSkeetConfig(homeIp)
  Logger.success(`Successfully added ${homeIp} to DB white list!\n`)
}

export const getHomeIp = async () => {
  const url = 'https://api.ipify.org/?format=json'
  let response = await sendGet(url)
  let data = await response.json()
  const ip = data.ip.replace(/\r?\n/g, '')
  return ip
}

export const sendGet = async (url: string) => {
  try {
    const res = fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
    return res
  } catch (e) {
    console.log({ e })
    throw new Error('sendGET failed')
  }
}

export const addHomeIpToSkeetConfig = async (ip: string) => {
  let skeetConfig: SkeetCloudConfig = await importConfig()
  const whiteList = skeetConfig.api.db.whiteList || ''
  skeetConfig.api.db.whiteList =
    whiteList === '' ? whiteList + `${ip}` : whiteList + `,${ip}`

  fs.writeFileSync(SKEET_CONFIG_PATH, JSON.stringify(skeetConfig, null, 2))
}
