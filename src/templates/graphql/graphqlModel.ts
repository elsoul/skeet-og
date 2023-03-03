import { getEnumCols, getModelCols } from '@/lib/getModelInfo'
import { GRAPHQL_PATH } from '@/lib/getNetworkConfig'
import { ModelSchema } from '@/lib/getModelInfo'
export type ModelSchemaArray = Array<ModelSchema>

export const graphqlModel = async (modelName: string) => {
  const filePath = GRAPHQL_PATH + '/modelManager/' + modelName + '/model.ts'
  const body = (await modelCodes(modelName)).join('\n')
  return {
    filePath,
    body,
  }
}

export const normalImport = async (modelName: string) => {
  const body = [
    `import { objectType } from 'nexus'`,
    `import { ${modelName} } from 'nexus-prisma'\n`,
  ]
  return body
}

export const modelCodes = async (modelName: string) => {
  const modelCols: ModelSchemaArray = await getModelCols(modelName)
  const enumNames = await getEnumCols(modelCols)
  let importArray = []
  let modelCodeArray = [
    `export const ${modelName}Object = objectType({`,
    `  name: ${modelName}.$name,`,
    `  description: ${modelName}.$description,`,
    `  definition(t) {`,
    `    t.relayGlobalId('id', {})`,
  ]

  importArray = await normalImport(modelName)
  for await (const importString of importArray.reverse()) {
    modelCodeArray.unshift(importString)
  }

  for await (const model of modelCols) {
    const addLine = `    t.field(${modelName}.${model.name})`
    modelCodeArray.push(addLine)
  }

  modelCodeArray.push('  },', '})')

  return modelCodeArray
}
