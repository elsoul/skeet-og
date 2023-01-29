import { GRAPHQL_PATH } from '@/lib/getNetworkConfig'

export const graphqlQuery = async (modelName: string) => {
  const filePath = GRAPHQL_PATH + '/' + modelName + '/query.ts'
  const body = `export * from './model'
export * from './query'
export * from './mutation'
`
  return {
    filePath,
    body,
  }
}
