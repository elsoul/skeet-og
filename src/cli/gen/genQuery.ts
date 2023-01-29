import fs from 'fs'
import { graphqlQuery } from '@/cli/templates/graphql'
import { Logger } from '@/lib/logger'

export const genQuery = async (modelName: string) => {
  const fileInfo = await graphqlQuery(modelName)
  fs.writeFileSync(fileInfo.filePath, fileInfo.body)
  Logger.success(`successfully created ✔ - ${fileInfo.filePath}`)
}
