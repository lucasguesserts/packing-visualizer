import FileFormatChecker from '../../../src/check/output/FileFormatChecker.mjs'
import fs from 'fs'
import path from 'path'

const dataDir = './test/data/check/output/FileFormatChecker/'

function caseCheck (subdirName, caseName, expected) {
  test(`case ${caseName}`, () => {
    const filePath = path.join(dataDir, subdirName, `${caseName}.json`)
    const data = JSON.parse(fs.readFileSync(filePath))
    const checker = new FileFormatChecker(data)
    expect(checker.isValid).toEqual(expected)
  })
}

describe('0.1.0', () => {
  const subdirName = '0_1_0/'
  const cases = [
    ['1', true],
    ['2', true],
    ['3', false],
    ['4', false],
    ['5', false],
    ['6', false],
    ['7', false],
    ['8', false]
  ]
  for (const [caseName, expected] of cases) {
    caseCheck(subdirName, caseName, expected)
  }
})

describe('0.2.0', () => {
  const subdirName = '0_2_0/'
  const cases = [
    ['1', true],
    ['2', false],
    ['3', false]
  ]
  for (const [caseName, expected] of cases) {
    caseCheck(subdirName, caseName, expected)
  }
})

describe('0.3.0', () => {
  const subdirName = '0_3_0/'
  const cases = [
    ['1', true],
    ['2', false],
    ['3', false],
    ['4', false],
    ['5', false],
    ['6', false],
    ['7', false],
    ['8', false]
  ]
  for (const [caseName, expected] of cases) {
    caseCheck(subdirName, caseName, expected)
  }
})
