import { GRAPHQL_PATH } from '@/lib/getNetworkConfig'

export const graphqlModel = async (modelName: string) => {
  const filePath = GRAPHQL_PATH + '/' + modelName + '/model.ts'
  const body = `export * from './model'
export * from './query'
export * from './mutation'
`
  return {
    filePath,
    body,
  }
}

const modelCodes = async (modelName: string) => {
  const modelCodeArray: Array<string> = [
    `import { objectType } from 'nexus'`,
    `import { ${modelName} } from 'nexus-prisma'\n`,
    `export const ${modelName}Object = objectType({`,
    `  name: ${modelName}.$name,`,
    `  description: ${modelName}.$description,`,
    `  definition(t) {`,
  ]

  return modelCodeArray
}
