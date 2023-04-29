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
    if (OutputChecker._hasOverlap(data)) {
      console.error('overlap found')
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

  static _hasOverlap (data) {
    const TOLERANCE = 1e-6
    const items = data.small_items
    for (const first of items) {
      for (const second of items) {
        if (first === second) continue
        const overlapX = ((first.x + TOLERANCE) < (second.x + second.length)) && ((second.x + TOLERANCE) < (first.x + first.length))
        const overlapY = ((first.y + TOLERANCE) < (second.y + second.length)) && ((second.y + TOLERANCE) < (first.y + first.length))
        const overlapZ = ((first.z + TOLERANCE) < (second.z + second.length)) && ((second.z + TOLERANCE) < (first.z + first.length))
        if (overlapX && overlapY && overlapZ) return true
      }
    }
    return false
  }
}

export default OutputChecker
