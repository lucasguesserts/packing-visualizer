import fs from 'fs'
import OutputChecker from '../check/OutputChecker.js'

export function cli () {
  const outputFilePath = process.argv[2]
  const output = JSON.parse(fs.readFileSync(outputFilePath))
  OutputChecker.check(output)
}
