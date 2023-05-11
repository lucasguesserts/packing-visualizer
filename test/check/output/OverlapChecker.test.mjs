import OverlapChecker from '../../../src/check/output/OverlapChecker.mjs'
import fs from 'fs'
import path from 'path'

const dataDir = './test/data/check/output/OverlapChecker/'

describe('overlap checker - from files', () => {
  const cases = [
    ['1', 0],
    ['2', 1],
    ['3', 2],
    ['4', 0]
  ]
  for (const [caseName, expected] of cases) {
    test(`case ${caseName}`, () => {
      const filePath = path.join(dataDir, `${caseName}.json`)
      const data = JSON.parse(fs.readFileSync(filePath))
      const checker = new OverlapChecker(data.small_items)
      expect(checker.numberOfOverlaps).toEqual(expected)
    })
  }
})

describe('overlap checker - all cases in a line', () => {
  const data = {
    type: 'output',
    version: '0.1.0',
    large_object: {
      length: 100,
      width: 100,
      height: 100
    },
    small_items: []
  }
  const initialItem = {
    length: 10,
    width: 10,
    height: 10,
    x: 10.0,
    y: 0.0,
    z: 0.0
  }
  const cases = [
    {
      item: {
        length: 1,
        width: 10,
        height: 10,
        x: 0.0,
        y: 0.0,
        z: 0.0
      },
      expected: false
    },
    {
      item: {
        length: 10,
        width: 10,
        height: 10,
        x: 5.0,
        y: 0.0,
        z: 0.0
      },
      expected: true
    },
    {
      item: {
        length: 1,
        width: 10,
        height: 10,
        x: 11.0,
        y: 0.0,
        z: 0.0
      },
      expected: true
    },
    {
      item: {
        length: 10,
        width: 10,
        height: 10,
        x: 7.0,
        y: 0.0,
        z: 0.0
      },
      expected: true
    },
    {
      item: {
        length: 10,
        width: 10,
        height: 10,
        x: 21.0,
        y: 0.0,
        z: 0.0
      },
      expected: false
    },
    {
      item: {
        length: 10,
        width: 10,
        height: 10,
        x: 0.0,
        y: 0.0,
        z: 0.0
      },
      expected: false
    },
    {
      item: {
        length: 10,
        width: 10,
        height: 10,
        x: 20.0,
        y: 0.0,
        z: 0.0
      },
      expected: false
    },
    {
      item: {
        length: 10,
        width: 10,
        height: 10,
        x: 10.0,
        y: 0.0,
        z: 0.0
      },
      expected: true
    }
  ]
  for (const [caseIndex, instance] of cases.entries()) {
    test(`case ${caseIndex}`, () => {
      data.small_items = [initialItem, instance.item]
      const checker = new OverlapChecker(data.small_items)
      expect(checker.hasOverlap).toEqual(instance.expected)
    })
  }
})
