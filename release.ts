import pjson from './package.json'
import * as fsPromise from 'fs/promises'

console.log(`updated version to ${pjson.version}`)

type Version = {
  version: string
}

const version: Version = {
  version: pjson.version,
}
const json = JSON.stringify(version)

const fileWrite = async () => {
  await fsPromise.writeFile('./src/lib/version.json', json, { flag: 'w' })
}

fileWrite()
