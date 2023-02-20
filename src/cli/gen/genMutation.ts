import fs from 'fs'
import { graphqlMutation } from '@/templates/graphql'
import { Logger } from '@/lib/logger'

export const genMutation = async (modelName: string) => {
  const fileInfo = await graphqlMutation(modelName)
  fs.writeFileSync(fileInfo.filePath, fileInfo.body)
  Logger.success(`successfully created ✔ - ${fileInfo.filePath}`)
}
