import FileFormatChecker from './input/FileFormatChecker.mjs'

class InputChecker {
  static check (data) {
    const fileFormatChecker = new FileFormatChecker(data)
    fileFormatChecker.log(data)
  }
}

export default InputChecker
