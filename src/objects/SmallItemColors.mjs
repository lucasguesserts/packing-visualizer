import randomColor from 'randomcolor'

class SmallItemColors {
  constructor (smallItems) {
    this.color_map = new Map()
    for (let i = 0; i < smallItems.length; ++i) {
      const item = smallItems[i]
      const hash = this.getHash(item)
      const color = randomColor({ seed: hash, luminosity: 'dark'})
      if (!this.color_map.has(hash)) {
        this.color_map.set(hash, color)
      }
    }
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
