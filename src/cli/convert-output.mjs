import fs from 'fs'
import FileFormatChecker from '../check/output/FileFormatChecker.mjs'
import OutputConversor from '../convert/output/OutputConversor.mjs'

export function cli () {
  const toConvertFilePath = process.argv[2]
  const targetVersion = process.argv[3]
  const convertedFilePath = process.argv[4]
  if (!fs.existsSync(toConvertFilePath)) {
    console.log(`file '${toConvertFilePath}' does not exist`)
    return
  }
  const dataToConvert = JSON.parse(fs.readFileSync(toConvertFilePath))
  const toConvertChecker = new FileFormatChecker(dataToConvert)
  if (!toConvertChecker.isValid) {
    throw new Error(`file '${toConvertFilePath}' is not valid`)
  }
  try {
    const dataConverted = OutputConversor.convert(dataToConvert, targetVersion)
    const convertedChecker = new FileFormatChecker(dataConverted)
    if (!convertedChecker.isValid) {
      throw new Error('something went wrong with the conversion, it is not valid')
    }
    fs.writeFileSync(convertedFilePath, JSON.stringify(dataConverted, null, 2))
  } catch (error) {
    console.error(error.message)
  }
}
