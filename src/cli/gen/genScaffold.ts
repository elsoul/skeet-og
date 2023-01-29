import fs from 'fs'
import { getNewModels } from './getModels'

export const genScaffold = async () => {
  const newModels = await getNewModels()
  newModels.forEach((line) => {})
}
