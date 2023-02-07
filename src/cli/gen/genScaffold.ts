import fs from 'fs'
import { Logger } from '@/lib/logger'
import { GRAPHQL_PATH, PRISMA_SCHEMA_PATH } from '@/lib/getNetworkConfig'
import { ModelSchema } from '@/lib/getModelInfo'
import * as Skeet from '.'

export const genScaffoldAll = async () => {
  const newModels = await getNewModels()
  newModels.forEach(async (modelName) => {
    await genScaffold(modelName)
  })
  await genGraphqlIndex()
}

export const genScaffold = async (modelName: string) => {
  await Skeet.genDir(modelName)
  await Skeet.genMutation(modelName)
  await Skeet.genModel(modelName)
  await Skeet.genQuery(modelName)
  await Skeet.genIndex(modelName)
}

export const genGraphqlIndex = async () => {
  const apiModels = await getApiModels()
  let exportArray: Array<string> = []
  apiModels.forEach((model) => {
    const str = `export * from './${model}'`
    exportArray.push(str)
  })
  const filePath = GRAPHQL_PATH + '/index.ts'
  fs.writeFileSync(filePath, exportArray.join('\n'), { flag: 'w' })
  Logger.success(`successfully created ✔ - ${filePath}`)
}

export const getNewModels = async () => {
  const apiModels = await getApiModels()
  const prismaModels = await getPrismaModels()
  const newMoldes = prismaModels.filter((x) => apiModels.indexOf(x) === -1)
  return newMoldes
}

export const getApiModels = async () => {
  const apiModels = fs
    .readdirSync(GRAPHQL_PATH, { withFileTypes: true })
    .filter((item) => item.isDirectory())
    .map((item) => item.name)

  return apiModels
}

export const getPrismaModels = async () => {
  const prismaSchema = fs.readFileSync(PRISMA_SCHEMA_PATH)
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
