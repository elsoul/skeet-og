import fs from 'fs'
import { graphqlQuery } from '@/cli/templates/graphql'

export const genQuery = async (modelName: string) => {
  const fileInfo = await graphqlQuery(modelName)
  fs.writeFileSync(fileInfo.filePath, fileInfo.body)
}
