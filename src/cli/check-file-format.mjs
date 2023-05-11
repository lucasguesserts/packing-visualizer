import fs from 'fs'
import InputChecker from '../check/InputChecker.mjs'
import OutputChecker from '../check/OutputChecker.mjs'

export function cli () {
  const filePath = process.argv[2]
  const data = JSON.parse(fs.readFileSync(filePath))
  switch (data.type) {
    case 'input':
      InputChecker.check(data)
      break
    case 'output':
      OutputChecker.check(data)
      break
    default:
      console.log(`Type ${data.type} not recognized.`)
  }
}
