import FileFormatChecker from './output/FileFormatChecker.mjs'
import OutsideItemsFinder from './output/OutsideItemsFinder.mjs'
import OverlapChecker from './output/OverlapChecker.mjs'

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

export default OutputChecker
