import Ajv from 'ajv/dist/2020'
import v_0_1_0 from '../file_format/output/0_1_0.json'

const TOLERANCE = 1e-6

class OutputChecker {
  static check (data) {
    const fileFormatChecker = new FileFormatChecker(data)
    fileFormatChecker.log(data)
    const overlapChecker = new OverlapChecker(data.small_items)
    overlapChecker.log()
    const outsideItemsFinder = new OutsideItemsFinder(data.large_object, data.small_items)
    outsideItemsFinder.log()
  }
}

class FileFormatChecker {
  constructor (data) {
    this.data = data
    this.validator = this._getValidator(this.data.version)
    this.isValid = this.validator(data)
    this.errors = this.validator.errors
  }

  log () {
    if (!this.isValid) {
      console.error(this.errors)
    } else {
      console.log('No problem found in output file')
    }
  }

  _getValidator (version) {
    const ajv = new Ajv()
    switch (version) {
      case '0.1.0':
        return ajv.compile(v_0_1_0)
      default:
        return this._invalidVersionValidator()
    }
  }

  _invalidVersionValidator () {
    function Validator (data) {
      return false
    }
    Validator.errors = `The version ${this.data.version} of the output is not supported`
    return Validator
  }
}

class OutsideItemsFinder {
  constructor (largeObject, smallItems) {
    this.largeObject = largeObject
    this.smallItems = smallItems
    this.itemsOutsideLargeObject = this._findItemsOutsideLargeObject()
  }

  log () {
    for (const sample of this.itemsOutsideLargeObject) {
      console.error(`Item outside container:\n${JSON.stringify(sample)}`)
    }
  }

  _findItemsOutsideLargeObject () {
    const itemsOutsideLargeObject = []
    for (let itemIndex = 0; itemIndex < this.smallItems.length; ++itemIndex) {
      const item = this.smallItems[itemIndex]
      if (this._isItemOutsideLargeObject(item)) {
        itemsOutsideLargeObject.push({ itemIndex, item })
      }
    }
    return itemsOutsideLargeObject
  }

  _isItemOutsideLargeObject (item) {
    return this._isItemBeforeOrigin(item) || this._isItemAfterLastPoint(item)
  }

  _isItemBeforeOrigin (item) {
    return ((item.x + TOLERANCE) < 0) || ((item.y + TOLERANCE) < 0) || ((item.z + TOLERANCE) < 0)
  }

  _isItemAfterLastPoint (item) {
    return ((item.x + item.length) > this.largeObject.length + TOLERANCE) ||
           ((item.y + item.width) > this.largeObject.width + TOLERANCE) ||
           ((item.z + item.height) > this.largeObject.height + TOLERANCE)
  }
}

class OverlapChecker {
  constructor (smallItems) {
    this.smallItems = smallItems
    this.overlaps = this._findOverlaps()
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

export default OutputChecker
