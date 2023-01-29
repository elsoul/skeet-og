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
