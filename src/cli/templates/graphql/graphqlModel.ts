import { getModelCols } from '@/cli/gen'
import { GRAPHQL_PATH } from '@/lib/getNetworkConfig'
import { ModelSchema } from '@/cli/gen'

export type ModelSchemaArray = Array<ModelSchema>

export const graphqlModel = async (modelName: string) => {
  const filePath = GRAPHQL_PATH + '/' + modelName + '/model.ts'
  const body = (await modelCodes(modelName)).join('')
  return {
    filePath,
    body,
  }
}

export const modelCodes = async (modelName: string) => {
  let modelCodeArray: Array<string> = [
    `import { objectType } from 'nexus'\n`,
    `import { ${modelName} } from 'nexus-prisma'\n\n`,
    `export const ${modelName}Object = objectType({\n`,
    `  name: ${modelName}.$name,\n`,
    `  description: ${modelName}.$description,\n`,
    `  definition(t) {\n`,
    `    t.relayGlobalId('id', {})\n`,
  ]
  const modelCols: ModelSchemaArray = await getModelCols(modelName)
  modelCols.forEach((model) => {
    const addLine = `    t.field(${modelName}.${model.name})\n`
    modelCodeArray.push(addLine)
  })
  modelCodeArray.push('  },\n', '})')

  return modelCodeArray
}
