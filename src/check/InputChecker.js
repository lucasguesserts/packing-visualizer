import Ajv from 'ajv/dist/2020'
import v_0_0_0 from '../file_format/input/0_0_0.json' // eslint-disable-line camelcase

class InputChecker {
  static check (data) {
    switch (data.version) {
      case '0.0.0':
        InputChecker._check_v_0_0_0(data)
        break
      default:
        console.error(`The version ${data.version} or the input is not supported`)
    }
  }

  static _check_v_0_0_0 (data) {
    const ajv = new Ajv()
    const validate = ajv.compile(v_0_0_0)
    const isValid = validate(data)
    if (!isValid) {
      console.error(validate.errors)
    } else {
      console.log('No problem found in input file')
    }
  }
}

export default InputChecker
