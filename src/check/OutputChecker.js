import Ajv from 'ajv/dist/2020'
import v_0_1_0 from '../file_format/output/0_1_0.json'

class OutputChecker {
  static check (data) {
    switch (data.version) {
      case '0.1.0':
        OutputChecker._check_v_0_1_0(data)
        break
      default:
        console.error(`The version ${data.version} or the output is not supported`)
    }
    const overlaps = OutputChecker._findOverlaps(data)
    if (overlaps.length) {
      for (const overlap of overlaps) {
        console.error(`There is an overlap between the items ${overlap.firstIndex} and ${overlap.secondIndex}`)
        console.error(`first item:\n${JSON.stringify(overlap.first)}`)
        console.error(`second item:\n${JSON.stringify(overlap.second)}`)
      }
    }
  }

  static _check_v_0_1_0 (data) {
    const ajv = new Ajv()
    const validate = ajv.compile(v_0_1_0)
    const isValid = validate(data)
    if (!isValid) {
      console.error(validate.errors)
    } else {
      console.log('No problem found in output file')
    }
  }

  static _findOverlaps (data) {
    const items = data.small_items
    const overlaps = []
    for (let firstIndex = 0; firstIndex < items.length; ++firstIndex) {
      const first = items[firstIndex]
      for (let secondIndex = firstIndex + 1; secondIndex < items.length; ++secondIndex) {
        const second = items[secondIndex]
        const overlapX = OutputChecker._hasOverlap(first.x, first.x + first.length, second.x, second.x + second.length)
        const overlapY = OutputChecker._hasOverlap(first.y, first.y + first.width, second.y, second.y + second.width)
        const overlapZ = OutputChecker._hasOverlap(first.z, first.z + first.height, second.z, second.z + second.height)
        if (overlapX && overlapY && overlapZ) {
          overlaps.push({ firstIndex, first, secondIndex, second })
        }
      }
    }
    return overlaps
  }

  static _hasOverlap (lhsXi, lhsXf, rhsXi, rhsXf) {
    const TOLERANCE = 1e-6
    return ((lhsXi + TOLERANCE) < rhsXf) && ((rhsXi + TOLERANCE) < lhsXf)
  }
}

export default OutputChecker
