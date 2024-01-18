class Reader {
  constructor (fileSelector, dataProcessorFunction) {
    this.fileSelector = fileSelector
  }

  setup (dataProcessorFunction) {
    this.fileSelector.addEventListener('change', (event) => {
      const fileToRead = event.target.files[0]
      if (this._isTypeValid(fileToRead)) {
        const reader = new FileReader() // eslint-disable-line no-undef
        reader.addEventListener('load', (event) => {
          const data = JSON.parse(event.target.result)
          dataProcessorFunction(data)
        })
        reader.readAsText(fileToRead)
      }
    })
  }

  _isTypeValid (fileToRead) {
    const valid = fileToRead.type && fileToRead.type.endsWith('json')
    if (!valid) {
      console.error(`File '${fileToRead}' is not a json, it is a ${fileToRead.type}.`)
    }
    return valid
  }
}

export default Reader
