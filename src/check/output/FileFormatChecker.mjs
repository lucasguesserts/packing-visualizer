import Ajv from 'ajv/dist/2020'
import v_0_1_0 from '../../file_format/output/0_1_0.json' // eslint-disable-line camelcase
import v_0_2_0 from '../../file_format/output/0_2_0.json' // eslint-disable-line camelcase
import v_0_3_0 from '../../file_format/output/0_3_0.json' // eslint-disable-line camelcase

class FileFormatChecker {
  constructor (data) {
    this.data = data
    this.validator = this._getValidator(this.data.version)
    this.isValid = this.validator(data)
    this.errors = this.validator.errors
  }

  log () {
    if (!this.isValid) {
      console.error(this.errors)
    } else {
      console.log('No problem found in output file')
    }
  }

  _getValidator (version) {
    const ajv = new Ajv()
    switch (version) {
      case '0.1.0':
        return ajv.compile(v_0_1_0)
      case '0.2.0':
        return ajv.compile(v_0_2_0)
      case '0.3.0':
        return ajv.compile(v_0_3_0)
      default:
        return this._invalidVersionValidator()
    }
  }

  _invalidVersionValidator () {
    function Validator (data) {
      return false
    }
    Validator.errors = `The version ${this.data.version} of the output is not supported`
    return Validator
  }
}

export default FileFormatChecker
