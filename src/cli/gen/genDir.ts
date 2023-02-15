import fs from 'fs'
import { GRAPHQL_PATH } from '@/lib/getNetworkConfig'

export const genDir = async (modelName: string) => {
  const fileDir = GRAPHQL_PATH + '/modelManager/' + modelName
  fs.mkdirSync(fileDir, { recursive: true })
}
