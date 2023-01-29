import fs from 'fs'
import { graphqlModel } from '@/cli/templates/graphql'

export const genModel = async (modelName: string) => {
  const model = await graphqlModel(modelName)
  fs.writeFileSync(model.filePath, model.body)
}
