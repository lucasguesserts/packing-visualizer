import randomColor from 'randomcolor'

class SmallItemColors {
  constructor (smallItems) {
    this.color_map = new Map()
    for (const item of smallItems) {
      const hash = this.getHash(item)
      if (!this.color_map.has(hash)) {
        this.color_map.set(hash, randomColor({ luminosity: 'dark' }))
      }
    }
    return
  }

  getHash (item) {
    const measurements = [item.measurement.x, item.measurement.y, item.measurement.z]
    measurements.sort()
    return 1000000 * measurements[0] + 1000 * measurements[1] + measurements[2]
  }

  getColor (item) {
    const hash = this.getHash(item)
    return this.color_map.get(hash)
  }
}

export default SmallItemColors
