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
    const TOLERANCE = 1e-6
    const items = data.small_items
    const overlaps = []
    for (let firstIndex = 0; firstIndex < items.length; ++firstIndex) {
      const first = items[firstIndex]
      for (let secondIndex = firstIndex + 1; secondIndex < items.length; ++secondIndex) {
        const second = items[secondIndex]
        const overlapX = ((first.x + TOLERANCE) < (second.x + second.length)) && ((second.x + TOLERANCE) < (first.x + first.length))
        const overlapY = ((first.y + TOLERANCE) < (second.y + second.length)) && ((second.y + TOLERANCE) < (first.y + first.length))
        const overlapZ = ((first.z + TOLERANCE) < (second.z + second.length)) && ((second.z + TOLERANCE) < (first.z + first.length))
        if (overlapX && overlapY && overlapZ) {
          overlaps.push({ firstIndex, first, secondIndex, second })
        }
      }
    }
    return overlaps
  }
}

export default OutputChecker
