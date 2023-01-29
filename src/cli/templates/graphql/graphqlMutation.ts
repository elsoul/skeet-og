import { GRAPHQL_PATH } from '@/lib/getNetworkConfig'

export const graphqlMutation = async (modelName: string) => {
  const filePath = GRAPHQL_PATH + '/' + modelName + '/mutation.ts'
  const body = `export * from './model'
export * from './query'
export * from './mutation'
`
  return {
    filePath,
    body,
  }
}
