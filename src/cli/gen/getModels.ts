import fs from 'fs'
import { importConfig } from '@/index'

export type SkeetGenConfig = Array<GenConf>

export type GenConf = {
  model: string
  scaffolded: false
}

export const importGenConfig = async () => {
  try {
    const config = fs.readFileSync(`${process.cwd()}/skeet-gen.config.json`)
    const json: SkeetGenConfig = JSON.parse(String(config))
    return json
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

export const syncGenConfig = async (models: Array<string>) => {
  const filePath = './skeet-gen.config.json'
  const fileExist = fs.existsSync(filePath)
  if (fileExist) {
    await updateGenConfig(models)
  } else {
    await genConfig(models)
  }
}

export const updateGenConfig = async (models: Array<string>) => {
  const filePath = './skeet-gen.config.json'
  let skeetGenConfig: SkeetGenConfig = await importGenConfig()
  const currentGenConfig: Array<string> = []
  skeetGenConfig.map((keyValue) => {
    currentGenConfig.push(keyValue.model)
  })
  const newMoldes = models.filter((x) => currentGenConfig.indexOf(x) === -1)
  console.log(newMoldes)
  newMoldes.forEach((model) => {
    skeetGenConfig.push({
      model,
      scaffolded: false,
    })
  })
  const body: Array<GenConf> = []
  skeetGenConfig.forEach((model) => {
    body.push(model)
  })
  fs.writeFileSync(filePath, JSON.stringify(body, null, 2))
}

export const genConfig = async (models: Array<string>) => {
  const filePath = './skeet-gen.config.json'
  const body: Array<GenConf> = []
  models.forEach((model) => {
    const dataHash: GenConf = {
      model,
      scaffolded: false,
    }
    body.push(dataHash)
  })
  fs.writeFileSync(filePath, JSON.stringify(body, null, 2))
}

export const genModels = async () => {
  const filePath = './apps/api/prisma/schema.prisma'
  const prismaSchema = fs.readFileSync(filePath)
  let splitSchema = String(prismaSchema).split('model ')
  splitSchema.shift()
  let modelNames: Array<string> = []
  splitSchema.forEach((line) => {
    const firstLine = line.split('\n')[0]
    const modelName = firstLine.replace(' {', '')
    modelNames.push(modelName)
  })
  return modelNames
}
