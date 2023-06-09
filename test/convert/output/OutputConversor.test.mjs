import OutputConversor from '../../../src/convert/output/OutputConversor.mjs'
import OutputConversionError from '../../../src/convert/output/OutputConversionError.mjs'
import fs from 'fs'
import path from 'path'

const dataDir = './test/data/convert/output/'

function caseCheck (subdirName, caseName) {
  test(`case ${caseName}`, () => {
    const filePath = path.join(dataDir, subdirName, `${caseName}.json`)
    const data = JSON.parse(fs.readFileSync(filePath))
    const actual = OutputConversor.convert(data.toConvert, data.expected.version)
    expect(actual).toEqual(data.expected)
  })
}

function caseCheckError (subdirName, caseName) {
  test(`case ${caseName} for error`, () => {
    const filePath = path.join(dataDir, subdirName, `${caseName}.json`)
    const data = JSON.parse(fs.readFileSync(filePath))
    expect(() => {
      OutputConversor.convert(data.toConvert, data.expected.version)
    }).toThrow(OutputConversionError)
  })
}

describe('0.2.0 to 0.3.0', () => {
  const subdirName = '0_2_0_to_0_3_0/'
  const cases = ['0', '1', '2']
  for (const caseName of cases) {
    caseCheck(subdirName, caseName)
  }
})

describe('0.2.0 to 0.3.0 - check error', () => {
  const subdirName = '0_2_0_to_0_3_0/'
  const cases = ['3']
  for (const caseName of cases) {
    caseCheckError(subdirName, caseName)
  }
})
