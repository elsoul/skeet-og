import { GRAPHQL_PATH } from '@/lib/getNetworkConfig'

export const graphqlIndex = async (modelName: string) => {
  const filePath = GRAPHQL_PATH + '/crudManager/' + modelName + '/index.ts'
  const body = `export * from './model'
export * from './query'
export * from './mutation'
`
  return {
    filePath,
    body,
  }
}
