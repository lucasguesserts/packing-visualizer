import FileFormatChecker from '../../../src/check/output/FileFormatChecker.mjs'
import fs from 'fs'
import path from 'path'

const dataDir = './test/data/check/output/FileFormatChecker/'

describe('outside items finder', () => {
  const cases = [
    ['1', true],
    ['2', true],
    ['3', false],
    ['4', false],
    ['5', false],
    ['6', false],
    ['7', false],
    ['8', false],
    ['9', true],
    ['10', false],
    ['11', false]
  ]
  for (const [caseName, expected] of cases) {
    test(`case ${caseName}`, () => {
      const filePath = path.join(dataDir, `${caseName}.json`)
      const data = JSON.parse(fs.readFileSync(filePath))
      const checker = new FileFormatChecker(data)
      expect(checker.isValid).toEqual(expected)
    })
  }
})
