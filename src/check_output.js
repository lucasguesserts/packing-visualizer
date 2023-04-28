import Ajv from 'ajv/dist/2020'
import v_0_1_0 from './file_format/output/0_1_0.json'

class OutputChecker {
  static check (input) {
    const ajv = new Ajv()
    const validate = ajv.compile(v_0_1_0)
    const isValid = validate(input)
    if (!isValid) {
      console.error(validate.errors)
    }
  }
}

export default OutputChecker
