import fs from 'fs'
import { graphqlIndex } from '@/templates/graphql'
import { Logger } from '@/lib/logger'

export const genIndex = async (modelName: string) => {
  const fileInfo = await graphqlIndex(modelName)
  fs.writeFileSync(fileInfo.filePath, fileInfo.body)
  Logger.success(`successfully created ✔ - ${fileInfo.filePath}`)
}
