import fs from 'fs'
import { graphqlIndex } from '@/cli/templates/graphql'

export const genIndex = async (modelName: string) => {
  const fileInfo = await graphqlIndex(modelName)
  fs.writeFileSync(fileInfo.filePath, fileInfo.body)
}
