import fs from 'fs'

export const genFiles = async (modelName: string) => {
  const fileDir = './apps/api/src/graphql/' + modelName
  fs.mkdirSync(fileDir)
}
