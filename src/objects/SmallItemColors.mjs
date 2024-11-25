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
    return 1000000 * item.measurement.z + 1000 * item.measurement.y + item.measurement.x
  }

  getColor (item) {
    const hash = this.getHash(item)
    return this.color_map.get(hash)
  }
}

export default SmallItemColors
