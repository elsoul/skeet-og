import fs from 'fs'

export const genScaffold = async () => {
  const filePath = './apps/api/prisma/schema.prisma'
  const prismaSchema = fs.readFileSync(filePath)
  let splitSchema = String(prismaSchema).split('model ')
  splitSchema.shift()
  let modelNames: Array<string> = []
  splitSchema.forEach((line) => {
    const firstLine = line.split('\n')[0]
    const modelName = firstLine.replace(' {', '')
    modelNames.push(modelName)
  })
  console.log(modelNames)
}
