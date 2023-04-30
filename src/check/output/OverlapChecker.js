const TOLERANCE = 1e-6

class OverlapChecker {
  constructor (smallItems) {
    this.smallItems = smallItems
    this.overlaps = this._findOverlaps()
  }

  get numberOfOverlaps () {
    return this.overlaps.length
  }

  get hasOverlap () {
    return this.overlaps.length > 0
  }

  log () {
    for (const overlap of this.overlaps) {
      console.error(`There is an overlap between the items ${overlap.firstIndex} and ${overlap.secondIndex}`)
      console.error(`first item:\n${JSON.stringify(overlap.first)}`)
      console.error(`second item:\n${JSON.stringify(overlap.second)}`)
    }
  }

  _findOverlaps () {
    const overlaps = []
    for (let firstIndex = 0; firstIndex < this.smallItems.length; ++firstIndex) {
      const first = this.smallItems[firstIndex]
      for (let secondIndex = firstIndex + 1; secondIndex < this.smallItems.length; ++secondIndex) {
        const second = this.smallItems[secondIndex]
        const overlapX = this._hasOverlap(first.x, first.x + first.length, second.x, second.x + second.length)
        const overlapY = this._hasOverlap(first.y, first.y + first.width, second.y, second.y + second.width)
        const overlapZ = this._hasOverlap(first.z, first.z + first.height, second.z, second.z + second.height)
        if (overlapX && overlapY && overlapZ) {
          overlaps.push({ firstIndex, first, secondIndex, second })
        }
      }
    }
    return overlaps
  }

  _hasOverlap (lhsXi, lhsXf, rhsXi, rhsXf) {
    return ((lhsXi + TOLERANCE) < rhsXf) && ((rhsXi + TOLERANCE) < lhsXf)
  }
}

export default OverlapChecker
