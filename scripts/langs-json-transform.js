const fs = require('fs')
const path = require('path')
const flatten = require('flat')
const unflatten = require('flat').unflatten
const jsonToProperties = (jsonString) => require('json-to-properties/src/scripts/parser').deflate(JSON.parse(jsonString))
const propertiesToJson = require('properties-to-json')

const flattenedPattern = '.properties'
const restoredPattern = '__restored.json'
const pathToLangDir = path.join(__dirname, '../src/lang')

function transformLangs () {
  const jsonFiles = fs.readdirSync(pathToLangDir).filter((filename) => filename.endsWith('.json') && !filename.endsWith(restoredPattern))
  const pathToJsonFiles = jsonFiles.map((jsonFile) => path.join(pathToLangDir, jsonFile))

  for (const pathToJsonFile of pathToJsonFiles) {
    const newPath = `${pathToJsonFile.replace('.json', flattenedPattern)}`
    const flattenedObj = flatten(JSON.parse(fs.readFileSync(pathToJsonFile).toString()))
    const entries = jsonToProperties(JSON.stringify(flattenedObj))
      .map(str => str
        .replace(/\n/gm, '\\n')
        .replace(/\s$/, '\\s')
      )
    fs.writeFileSync(newPath, `${entries.join('\n')}\n`)
  }
}

function restoreLangs () {
  const flattenedJsonFiles = fs.readdirSync(pathToLangDir).filter((filename) => filename.endsWith(flattenedPattern))
  const pathToJsonFiles = flattenedJsonFiles.map((jsonFile) => path.join(pathToLangDir, jsonFile))

  for (const pathToJsonFile of pathToJsonFiles) {
    const newPath = pathToJsonFile.replace(flattenedPattern, restoredPattern)
    const propertiesString = fs.readFileSync(pathToJsonFile).toString().trim()
    const unflattenedObjectJson = JSON.stringify(unflatten(Object.fromEntries(
      Object.entries(propertiesToJson(propertiesString))
        .map(([key, value]) => [
          key,
          value
            .replace(/\\n/g, '\n')
            .replace(/\\s/g, ' ')
        ])
    )), null, 2)

    fs.writeFileSync(newPath, unflattenedObjectJson)
    fs.rmSync(pathToJsonFile)
  }
}

function run () {
  const mode = process.argv.includes('--transform')
    ? 'transform'
    : process.argv.includes('--restore')
      ? 'restore'
      : 'unknown'

  if (mode === 'unknown') return
  ({
    transform: transformLangs,
    restore: restoreLangs
  }[mode])()
}

run()
