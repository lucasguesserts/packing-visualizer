import OutsideItemsFinder from '../../../src/check/output/OutsideItemsFinder.js'
import fs from 'fs'
import path from 'path'

const dataDir = './test/data/check/output/OutsideItemsFinder/'

describe('outside items finder', () => {
  const cases = [
    ['1', true],
    ['2', true],
    ['3', false],
    ['4', false],
    ['5', false]
  ]
  for (const [caseName, expected] of cases) {
    test(`case ${caseName}`, () => {
      const filePath = path.join(dataDir, `${caseName}.json`)
      const data = JSON.parse(fs.readFileSync(filePath))
      const checker = new OutsideItemsFinder(data.large_object, data.small_items)
      expect(checker.hasItemOutsideLimits()).toEqual(expected)
    })
  }
})
