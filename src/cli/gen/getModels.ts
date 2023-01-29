import fs from 'fs'
import { GRAPHQL_PATH, PRISMA_SCHEMA_PATH } from '@/lib/getNetworkConfig'

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
