import { getModelCols } from '@/lib/getModelInfo'
import { GRAPHQL_PATH } from '@/lib/getNetworkConfig'
import { toUpperCase, toLowerCase } from '@/lib/strLib'

export const graphqlMutation = async (modelName: string) => {
  const filePath = GRAPHQL_PATH + '/' + modelName + '/mutation.ts'
  const createModelArray = await createModelCodes(modelName)
  const updateModelArray = await updateModelCodes(modelName)
  const deleteModelArray = await deleteModelCodes(modelName)
  let mutationArray = createModelArray.concat(
    updateModelArray,
    deleteModelArray
  )
  const body = mutationArray.join('\n')
  return {
    filePath,
    body,
  }
}

export const createModelCodes = async (modelName: string) => {
  const modelNameUpper = await toUpperCase(modelName)
  const modelNameLower = await toLowerCase(modelName)
  let codeArray = [
    `import { extendType, nonNull, stringArg, intArg } from 'nexus'`,
    `import { fromGlobalId } from 'graphql-relay'`,
    `import { ${modelNameUpper} } from 'nexus-prisma'\n`,
    `export const ${modelNameUpper}Mutation = extendType({`,
    `  type: 'Mutation',`,
    `  definition(t) {`,
    `    t.field('create${modelNameUpper}', {`,
    `      type: ${modelNameUpper}.$name,`,
    `      args: {`,
  ]
  let createInputArray = await createInputArgs(modelName)
  codeArray = codeArray.concat(createInputArray)
  codeArray.push('      },')
  codeArray.push(`      async resolve(_, args, ctx) {`)
  codeArray.push(
    '        try {',
    `          return await ctx.prisma.${modelNameLower}.create({`,
    `            data: args,`,
    '          })',
    '        } catch (error) {',
    '          console.log(error)',
    '          throw new Error(`error: ${error}`)',
    '        }',
    '      },',
    '    })'
  )
  return codeArray
}

export const updateModelCodes = async (modelName: string) => {
  const modelNameUpper = await toUpperCase(modelName)
  const modelNameLower = await toLowerCase(modelName)
  let codeArray = [
    `    t.field('update${modelNameUpper}', {`,
    `      type: ${modelNameUpper}.$name,`,
    `      args: {`,
    `        id: nonNull(stringArg()),`,
  ]
  let createInputArray = await createInputArgs(modelName + '?', true, true)
  createInputArray.shift()
  codeArray = codeArray.concat(createInputArray)
  codeArray.push(
    '      },',
    `      async resolve(_, args, ctx) {`,
    '        const id = Number(fromGlobalId(args.id).id)',
    '        let data = JSON.parse(JSON.stringify(args))',
    '        delete data.id',
    '        try {',
    `          return await ctx.prisma.${modelNameLower}.update({`,
    '            where: {',
    '              id',
    '            },',
    `            data`,
    '          })',
    '        } catch (error) {',
    '          console.log(error)',
    '          throw new Error(`error: ${error}`)',
    '        }',
    '      },',
    '    })'
  )
  return codeArray
}

export const deleteModelCodes = async (modelName: string) => {
  const modelNameUpper = await toUpperCase(modelName)
  const modelNameLower = await toLowerCase(modelName)
  let codeArray = [
    `    t.field('delete${modelNameUpper}', {`,
    `      type: ${modelNameUpper}.$name,`,
    `      args: {`,
    `        id: nonNull(stringArg()),`,
    `      },`,
    '      async resolve(_, { id }, ctx) {',
    '        try {',
    `          return await ctx.prisma.${modelNameLower}.delete({`,
    '            where: {',
    '              id: Number(fromGlobalId(id).id),',
    '            },',
    '          })',
    '        } catch (error) {',
    '          throw new Error(`error: ${error}`)',
    '        }',
    '      },',
    '    })',
    '  },',
    '})',
  ]
  return codeArray
}

export const createInputArgs = async (
  modelName: string,
  withId: boolean = false,
  isUpdate: boolean = false
) => {
  const modelCols = await getModelCols(modelName)
  let stringArray: Array<string> = []
  modelCols.forEach((model) => {
    const inputMethod = isUpdate
      ? typeToInputMethodUpdate(model.type)
      : typeToInputMethod(model.type)
    if (model.name === 'id') {
      if (withId) {
        const str = `        ${model.name}: ${inputMethod},`
        stringArray.push(str)
      }
    } else {
      const str = `        ${model.name}: ${inputMethod},`
      stringArray.push(str)
    }
  })
  return stringArray
}

export const createParamStr = async (
  modelName: string,
  withId: boolean = false
) => {
  const modelCols = await getModelCols(modelName)
  let modelArray: Array<string> = []
  modelCols.forEach((model) => {
    if (model.name === 'id') {
      if (withId) {
        modelArray.push(model.name)
      }
    } else {
      modelArray.push(model.name)
    }
  })
  return modelArray.join(', ')
}

export const typeToInputMethod = (type: string) => {
  switch (type) {
    case 'String':
      return 'nonNull(stringArg())'
    case 'String?':
      return 'stringArg()'
    case 'Int':
      return 'nonNull(intArg())'
    case 'Int?':
      return 'intArg()'
    case 'DateTime':
      return 'stringArg()'
    default:
      return 'stringArg()'
  }
}

export const typeToInputMethodUpdate = (type: string) => {
  switch (type) {
    case 'String':
      return 'stringArg()'
    case 'String?':
      return 'stringArg()'
    case 'Int':
      return 'intArg()'
    case 'Int?':
      return 'intArg()'
    case 'DateTime':
      return 'stringArg()'
    default:
      return 'stringArg()'
  }
}
