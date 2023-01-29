import { getModelCols } from '@/cli/gen'
import { GRAPHQL_PATH, ModelSchema } from '@/lib/getNetworkConfig'

export type ModelSchemaArray = Array<ModelSchema>

export const graphqlModel = async (modelName: string) => {
  const filePath = GRAPHQL_PATH + '/' + modelName + '/model.ts'
  const body = (await modelCodes(modelName)).join('\n')
  return {
    filePath,
    body,
  }
}

export const modelCodes = async (modelName: string) => {
  let modelCodeArray: Array<string> = [
    `import { objectType } from 'nexus'`,
    `import { ${modelName} } from 'nexus-prisma'\n`,
    `export const ${modelName}Object = objectType({`,
    `  name: ${modelName}.$name,`,
    `  description: ${modelName}.$description,`,
    `  definition(t) {`,
    `    t.relayGlobalId('id', {})`,
  ]
  const modelCols: ModelSchemaArray = await getModelCols(modelName)
  modelCols.forEach((model) => {
    const addLine = `    t.field(${modelName}.${model.name})`
    modelCodeArray.push(addLine)
  })
  modelCodeArray.push('  },', '})')

  return modelCodeArray
}
