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
}

export default OutputChecker
