const fs = require('fs')
const path = require('path')
const flatten = require('flat')
const unflatten = require('flat').unflatten

const flattenedPattern = '__flattened.json'
const restoredPattern = '__restored.json'
const pathToLangDir = path.join(__dirname, '../src/lang')

function flattenLangs () {
  const jsonFiles = fs.readdirSync(pathToLangDir).filter((filename) =>
    filename.endsWith('.json') &&
    !filename.endsWith(flattenedPattern) &&
    !filename.endsWith(restoredPattern)
  )
  const pathToJsonFiles = jsonFiles.map((jsonFile) => path.join(pathToLangDir, jsonFile))

  for (const pathToJsonFile of pathToJsonFiles) {
    const newPath = `${pathToJsonFile.replace('.json', flattenedPattern)}`
    const flattenedObjectJson = JSON.stringify(flatten(JSON.parse(fs.readFileSync(pathToJsonFile).toString())), null, 2)
    fs.writeFileSync(newPath, flattenedObjectJson)
  }
}

function unflattenLangs () {
  const flattenedJsonFiles = fs.readdirSync(pathToLangDir).filter((filename) => filename.endsWith(flattenedPattern))
  const pathToJsonFiles = flattenedJsonFiles.map((jsonFile) => path.join(pathToLangDir, jsonFile))

  for (const pathToJsonFile of pathToJsonFiles) {
    const newPath = `${pathToJsonFile.replace(flattenedPattern, restoredPattern)}`
    const unflattenedObjectJson = JSON.stringify(unflatten(JSON.parse(fs.readFileSync(pathToJsonFile).toString())), null, 2)
    fs.writeFileSync(newPath, unflattenedObjectJson)
    fs.rmSync(pathToJsonFile)
  }
}

function run () {
  const mode = process.argv.includes('--flatten')
    ? 'flatten'
    : process.argv.includes('--unflatten')
      ? 'unflatten'
      : 'unknown'

  if (mode === 'unknown') return
  ({
    flatten: flattenLangs,
    unflatten: unflattenLangs
  }[mode])()
}

run()
