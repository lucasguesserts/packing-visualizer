import fs from 'fs'
import path from 'path'
import * as dfd from 'danfojs-node'

const NUMBER_OF_INSTANCE_SETS = 10
const NUMBER_OF_INSTANCES_PER_SET = 100
const DEFAULT_VOLUME_USAGE = 0

function range (n) {
  return [...Array(n).keys()].map(i => i + 1)
}

function readFile (filePath) {
  return JSON.parse(fs.readFileSync(filePath))
}

function volume (obj) {
  return obj.length * obj.width * obj.height
}

function toPercent (fraction) {
  return 100 * fraction
}

function getVolumeUsage (data) {
  const largeObjectVolume = volume(data.large_object)
  const smallItemsVolume = data.small_items.map(volume)
  const smallItemsTotalVolume = smallItemsVolume.reduce(
    (accumulator, currentValue) => accumulator + currentValue
  )
  return smallItemsTotalVolume / largeObjectVolume
}

function makeFilePath (instanceSetNumber, instanceNumber) {
  return `set_${instanceSetNumber}/${instanceNumber}.json`
}

function getDataDir () {
  const dataDir = process.argv[2]
  if (!fs.existsSync(dataDir)) {
    throw new Error(`The dir '${dataDir} does not exist`)
  }
  return dataDir
}

function makeDf (data) {
  const df = new dfd.DataFrame(
    data,
    {
      columns: ['set', 'instance', 'usage']
    }
  )
  return df
}

function collectData (dataDir) {
  const data = []
  for (const instanceSetNumber of range(NUMBER_OF_INSTANCE_SETS)) {
    for (const instanceNumber of range(NUMBER_OF_INSTANCES_PER_SET)) {
      let volumeUsage = -1
      try {
        let filePath = makeFilePath(instanceSetNumber, instanceNumber)
        filePath = path.join(dataDir, filePath)
        const object = readFile(filePath)
        volumeUsage = toPercent(getVolumeUsage(object))
      } catch (error) {
        volumeUsage = DEFAULT_VOLUME_USAGE
      } finally {
        data.push({ instanceSetNumber, instanceNumber, volumeUsage })
      }
    }
  }
  return data
}

function makeMeansDf (df) {
  const means = df.groupby(['set']).agg({ usage: 'mean' })
  means.rename({ usage_mean: 'heuristic' }, { inplace: true })
  means.addColumn(
    'BR',
    means.column('set').map(i => `BR_${i}`),
    { inplace: true }
  )
  means.setIndex({
    index: Array.from(means.column('BR').values),
    inplace: true
  })
  means.drop({ columns: ['set', 'BR'], inplace: true })
  return means
}

function getPaperDf () {
  const columns = ['paper']
  const index = [
    'BR_1',
    'BR_2',
    'BR_3',
    'BR_4',
    'BR_5',
    'BR_6',
    'BR_7',
    'BR_8',
    'BR_9',
    'BR_10'
  ]
  const data = [
    [95.69],
    [96.24],
    [96.49],
    [96.31],
    [96.18],
    [96.05],
    [95.77],
    [95.33],
    [95.07],
    [94.97]
  ]
  const df = new dfd.DataFrame(
    data,
    { index, columns }
  )
  return df
}

function joinWithPaperResults (df) {
  const instanceSetDf = new dfd.DataFrame(df.index.map(i => [i]), { columns: ['Set'] }) // it must be a 2D series to create as a column
  const paperDf = getPaperDf()
  const joined = dfd.concat({
    dfList: [instanceSetDf, df, paperDf],
    axis: 1
  })
  return joined
}

function getOutputFile () {
  return process.argv[3]
}

function saveCsv (df) {
  dfd.toCSV(
    df,
    {
      filePath: 'foo.csv',
      header: true,
      sep: ','
    }
  )
}

export function cli () {
  const dataDir = getDataDir()
  const outputFile = getOutputFile()
  const data = collectData(dataDir)
  const df = makeDf(data)
  const means = makeMeansDf(df)
  const comparison = joinWithPaperResults(means)
  saveCsv(comparison, outputFile)
}
