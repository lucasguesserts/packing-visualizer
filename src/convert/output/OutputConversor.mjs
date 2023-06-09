import C_0_2_0_to_0_3_0 from './0_2_0_to_0_3_0.mjs' // eslint-disable-line camelcase
import OutputConversionError from './OutputConversionError.mjs'

function joinVersions (lhs, rhs) {
  return `${lhs}@${rhs}`
}

class OutputConversor {
  static convert (data, targetVersion) {
    switch (joinVersions(data.version, targetVersion)) {
      case joinVersions('0.2.0', '0.3.0'):
        return C_0_2_0_to_0_3_0(data)
      default:
        throw new OutputConversionError(data.version, targetVersion)
    }
  }
}

export default OutputConversor
