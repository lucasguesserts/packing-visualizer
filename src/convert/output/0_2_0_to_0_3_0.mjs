function C_0_2_0_to_0_3_0 (data) { // eslint-disable-line camelcase
  // mandatory fields
  const converted = {
    type: 'output',
    version: '0.3.0',
    large_object: {
      measurement: {
        x: data.large_object.length,
        y: data.large_object.width,
        z: data.large_object.height
      }
    },
    small_items: data.small_items.map(item => {
      return {
        measurement: {
          x: item.length,
          y: item.width,
          z: item.height
        },
        position: {
          x: item.x,
          y: item.y,
          z: item.z
        }
      }
    })
  }
  // optional fields
  if (Object.hasOwn(data, 'appendix')) {
    converted.appendix = data.appendix
  }
  return converted
}

export default C_0_2_0_to_0_3_0 // eslint-disable-line camelcase
