import FileFormatChecker from './output/FileFormatChecker.js'
import OutsideItemsFinder from './output/OutsideItemsFinder.js'
import OverlapChecker from './output/OverlapChecker.js'

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
