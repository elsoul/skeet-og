import fs from 'fs'
import { Logger } from '@/lib/logger'
import { GRAPHQL_PATH, PRISMA_SCHEMA_PATH } from '@/lib/getNetworkConfig'

export type ModelSchema = {
  name: string
  type: string
}

export const genModel = async (modelName: string) => {}

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

export const getModelCols = async (modelName: string) => {
  try {
    const prismaSchema = fs.readFileSync(PRISMA_SCHEMA_PATH)
    let splitSchema = String(prismaSchema).split(`model `)
    splitSchema = splitSchema.filter((model) => model.match(`\^${modelName} `))
    let modelCols = splitSchema[0].split('\n')
    let schemaArray: Array<string> = []
    modelCols.forEach((line) => {
      if (
        line !== '' &&
        !line.includes(' {') &&
        !line.includes('}') &&
        !line.includes('[]')
      ) {
        schemaArray.push(line)
      }
    })
    let modelSchema: Array<ModelSchema> = []
    schemaArray.forEach((line) => {
      let splitArray = line.split(' ')
      splitArray = splitArray.filter((item) => item !== '')
      if (splitArray[2]) {
        if (splitArray[2].includes('@relation')) {
        } else {
          modelSchema.push({
            name: splitArray[0],
            type: splitArray[1],
          })
        }
      } else {
        modelSchema.push({
          name: splitArray[0],
          type: splitArray[1],
        })
      }
    })
    return modelSchema
  } catch (error) {
    let errorMsg = `error: can't find ${modelName}`
    return Logger.errorString(errorMsg)
  }
}
