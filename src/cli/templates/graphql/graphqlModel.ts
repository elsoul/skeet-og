import { getEnumCols, getModelCols } from '@/lib/getModelInfo'
import { toUpperCase, toLowerCase } from '@/lib/strLib'
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

const graphqlEnum = async (param: string) => {
  const lowerParam = await toLowerCase(param)
  const upperParam = await toUpperCase(param)
  const body = [
    `const ${lowerParam}Enum = enumType({`,
    `  name: '${upperParam}',`,
    `  members: Object.values(${upperParam}),`,
    `})\n`,
  ]
  return body
}

export const enumImport = async (
  modelName: string,
  enumArray: Array<string>
) => {
  const upperEnumNames = []
  for await (const enumName of enumArray) {
    upperEnumNames.push(await toUpperCase(enumName))
  }
  const enumString = upperEnumNames.join(', ')
  const body = [
    `import { ${enumString} } from '@prisma/client'`,
    `import { enumType, objectType } from 'nexus'`,
    `import { ${modelName} } from 'nexus-prisma'\n`,
  ]
  return body
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
  if (enumNames.length === 0) {
    importArray = await normalImport(modelName)
    for await (const importString of importArray.reverse()) {
      modelCodeArray.unshift(importString)
    }
  } else {
    importArray = await enumImport(modelName, enumNames)
    let enumArray = []
    for await (const enumName of enumNames) {
      const body = await graphqlEnum(enumName)
      for await (const line of body) {
        enumArray.push(line)
      }
    }
    for await (const importString of enumArray.reverse()) {
      modelCodeArray.unshift(importString)
    }
    for await (const importString of importArray.reverse()) {
      modelCodeArray.unshift(importString)
    }
  }

  let enumParams = []
  for await (const model of modelCols) {
    if (model.type === 'Enum') {
      const addLine = `    t.field(${modelName}.${model.name}.name, { type: ${model.name}Enum })`
      modelCodeArray.push(addLine)
      enumParams.push(model.name)
    } else {
      const addLine = `    t.field(${modelName}.${model.name})`
      modelCodeArray.push(addLine)
    }
  }

  modelCodeArray.push('  },', '})')

  return modelCodeArray
}
