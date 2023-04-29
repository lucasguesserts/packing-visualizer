const TOLERANCE = 1e-6

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

export default OutsideItemsFinder
