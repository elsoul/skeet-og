import fs from 'fs'
import { Logger } from '@/lib/logger'
import { PRISMA_SCHEMA_PATH } from '@/lib/getNetworkConfig'

export type ModelSchema = {
  name: string
  type: string
}

export const prismaSchemaType = [
  'ID',
  'String',
  'Int',
  'Float',
  'DateTime',
  'Boolean',
]

export const isEnum = async (type: string) => {
  let param = prismaSchemaType.filter(
    (typeName) => type === typeName || type === typeName + '?'
  )
  if (param.length == 0) {
    return true
  } else {
    return false
  }
}

export const getEnumCols = async (modelCols: Array<ModelSchema>) => {
  let enumCols = []
  for await (const model of modelCols) {
    if (model.type == 'Enum') {
      enumCols.push(model.name)
    }
  }
  return enumCols
}

export const getModelCols = async (modelName: string) => {
  try {
    const prismaSchema = fs.readFileSync(PRISMA_SCHEMA_PATH)
    let splitSchema = String(prismaSchema).split(`model `)
    splitSchema = splitSchema.filter((model) => model.match(`\^${modelName} `))
    let modelCols = splitSchema[0].split('\n')
    let schemaArray: Array<string> = []
    for await (const line of modelCols) {
      if (
        line !== '' &&
        !line.includes(' {') &&
        !line.includes('}') &&
        !line.includes('[]') &&
        !line.includes('atedAt')
      ) {
        schemaArray.push(line)
      } else if (line === '}') {
        break
      }
    }
    let modelSchema: Array<ModelSchema> = []
    for await (const line of schemaArray) {
      let splitArray = line.split(' ')
      splitArray = splitArray.filter((item) => item !== '')
      let isEnumResult = await isEnum(splitArray[1])
      let type = isEnumResult ? 'Enum' : splitArray[1]
      if (splitArray[0] == 'id') continue
      if (splitArray[2]) {
        if (splitArray[2].includes('@relation')) {
        } else {
          modelSchema.push({
            name: splitArray[0],
            type,
          })
        }
      } else {
        modelSchema.push({
          name: splitArray[0],
          type,
        })
      }
    }
    return modelSchema
  } catch (error) {
    let errorMsg = `error: can't find ${modelName}`
    Logger.error(errorMsg)
    return []
  }
}
