import FileFormatChecker from '../../../src/check/input/FileFormatChecker.mjs'
import fs from 'fs'
import path from 'path'

const dataDir = './test/data/check/input/FileFormatChecker/'

function check (subdirName, caseName, expected) {
  test(`case ${caseName}`, () => {
    const filePath = path.join(dataDir, subdirName, `${caseName}.json`)
    const data = JSON.parse(fs.readFileSync(filePath))
    const checker = new FileFormatChecker(data)
    expect(checker.isValid).toEqual(expected)
  })
}

describe('0.0.0', () => {
  const subdirName = '0_0_0/'
  const cases = [
    ['1', true],
    ['2', true],
    ['3', false],
    ['4', false],
    ['5', false],
    ['6', false],
    ['7', false]
  ]
  for (const [caseName, expected] of cases) {
    check(subdirName, caseName, expected)
  }
})

describe('0.1.0', () => {
  const subdirName = '0_1_0/'
  const cases = [
    ['1', true],
    ['2', true],
    ['3', false],
    ['4', false],
    ['5', false],
    ['6', false],
    ['7', false]
  ]
  for (const [caseName, expected] of cases) {
    check(subdirName, caseName, expected)
  }
})

describe('0.2.0', () => {
  const subdirName = '0_2_0/'
  const cases = [
    ['1', true],
    ['2', true],
    ['3', true],
    ['4', true],
    ['5', false],
    ['6', false],
    ['7', false],
    ['8', false]
  ]
  for (const [caseName, expected] of cases) {
    check(subdirName, caseName, expected)
  }
})

describe('0.3.0', () => {
  const subdirName = '0_3_0/'
  const cases = [
    ['1', true],
    ['2', true],
    ['3', true],
    ['4', true],
    ['5', false],
    ['6', false],
    ['7', false],
    ['8', false]
  ]
  for (const [caseName, expected] of cases) {
    check(subdirName, caseName, expected)
  }
})
