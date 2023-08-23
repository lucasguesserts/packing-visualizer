import clone from 'just-clone'

import FileFormatChecker from '../../check/input/FileFormatChecker.mjs'

function C_0_4_0_to_0_5_0 (data) { // eslint-disable-line camelcase
  // mandatory fields
  const converted = clone(data)
  converted.version = '0.5.0'
  // handle appendix.empty_spaces
  const fileFormatChecker = new FileFormatChecker(converted)
  if (Object.hasOwn(converted, 'appendix') && Object.hasOwn(converted.appendix, 'empty_spaces') && !fileFormatChecker.isValid) {
    delete converted.appendix.empty_spaces // property may not comply with new standard so it is deleted
  }
  return converted
}

export default C_0_4_0_to_0_5_0 // eslint-disable-line camelcase
