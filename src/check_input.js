import Ajv from 'ajv/dist/2020'
import v_0_0_0 from './file_format/input/0_0_0.json'

class InputChecker {
  static check (input) {
    const ajv = new Ajv()
    const validate = ajv.compile(v_0_0_0)
    const isValid = validate(input)
    if (!isValid) {
      console.error(validate.errors)
    } else {
      console.log('No problem found in input file')
    }
  }
}

export default InputChecker
