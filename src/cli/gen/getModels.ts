import fs from 'fs'
import { graphqlModel } from '@/templates/graphql'
import { Logger } from '@/lib/logger'

export const genModel = async (modelName: string) => {
  const fileInfo = await graphqlModel(modelName)
  fs.writeFileSync(fileInfo.filePath, fileInfo.body)
  Logger.success(`successfully created ✔ - ${fileInfo.filePath}`)
}
