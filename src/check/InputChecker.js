import FileFormatChecker from './input/FileFormatChecker.js'

class InputChecker {
  static check (data) {
    const fileFormatChecker = new FileFormatChecker(data)
    fileFormatChecker.log(data)
  }
}

export default InputChecker
