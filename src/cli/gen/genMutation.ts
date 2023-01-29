import fs from 'fs'
import { graphqlMutation } from '@/cli/templates/graphql'

export const genMutation = async (modelName: string) => {
  const fileInfo = await graphqlMutation(modelName)
  fs.writeFileSync(fileInfo.filePath, fileInfo.body)
}
