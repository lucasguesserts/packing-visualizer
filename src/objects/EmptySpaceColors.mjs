import randomColor from 'randomcolor'

class EmptySpaceColors {
  constructor (emptySpacesArray) {
    this.color_map = new Map()
    for (const emptySpaces of emptySpacesArray) {
      for (const emptySpace of emptySpaces) {
        console.log(JSON.stringify(emptySpace))
        const hash = this.getHash(emptySpace)
        if (!this.color_map.has(hash)) {
          this.color_map.set(hash, randomColor({ luminosity: 'light' }))
        }
      }
    }
  }

  getHash (emptySpace) {
    return 1000000 * emptySpace.measurement.z + 1000 * emptySpace.measurement.y + emptySpace.measurement.x
  }

  getColor (emptySpace) {
    const hash = this.getHash(emptySpace)
    return this.color_map.get(hash)
  }
}

export default EmptySpaceColors
