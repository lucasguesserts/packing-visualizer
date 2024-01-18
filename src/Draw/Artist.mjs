import * as THREE from 'three'
import OutputChecker from '../check/OutputChecker.mjs'
import OutputConversor from '../convert/output/OutputConversor.mjs'

import SmallItem from './SmallItem.mjs'
import LargeObject from './LargeObject.mjs'
import EmptySpace from './EmptySpace.mjs'

const supportedOutputFileFormatVersion = '0.5.0'

class Artist {
  get CAMERA_ZOOM_OUT_ON_LOAD () {
    return 1.5
  }

  get AXES_HELPER_RELATIVE_SIZE () {
    return 3
  }

  constructor (data) {
    this.data = data
    if (this.data.version !== supportedOutputFileFormatVersion) {
      this.data = OutputConversor.convert(this.data, supportedOutputFileFormatVersion)
    }
    OutputChecker.check(this.data)
  }

  draw (scene, camera, visibilityController) {
    visibilityController.reset()
    this._cleanScene(scene)
    this._addLargeObject(scene)
    this._addSmallItems(scene, visibilityController)
    this._addEmptySpaces(scene, visibilityController)
    this._addAxes(scene)
    this._moveCamera(camera)
  }

  _cleanScene (scene) {
    while (scene.children.length > 0) {
      scene.remove(scene.children[0])
    }
  }

  _addLargeObject (scene) {
    const largeObject = new LargeObject(
      this.data.large_object.measurement.y,
      this.data.large_object.measurement.z,
      this.data.large_object.measurement.x
    )
    largeObject.draw(scene)
  }

  _addSmallItems (scene, slider) {
    for (const item of this.data.small_items) {
      const smallItem = new SmallItem(
        item.measurement.y,
        item.measurement.z,
        item.measurement.x,
        item.position.y,
        item.position.z,
        item.position.x
      )
      smallItem.draw(scene)
      slider.addSmallItem(smallItem)
    }
  }

  _addEmptySpaces (scene, emptySpacesButton) {
    if (Object.hasOwn(this.data, 'appendix') && Object.hasOwn(this.data.appendix, 'empty_spaces')) {
      for (const emptySpaceSetData of this.data.appendix.empty_spaces) {
        const emptySpaceSet = emptySpaceSetData.map(
          (emptySpaceData) => new EmptySpace(
            emptySpaceData.measurement.y,
            emptySpaceData.measurement.z,
            emptySpaceData.measurement.x,
            emptySpaceData.position.y,
            emptySpaceData.position.z,
            emptySpaceData.position.x
          ))
        emptySpaceSet.forEach(emptySpace => emptySpace.draw(scene))
        emptySpacesButton.addEmptySpaceSet(emptySpaceSet)
      }
    }
  }

  _addAxes (scene) {
    const axes = new THREE.AxesHelper()
    axes.scale.set(
      this.AXES_HELPER_RELATIVE_SIZE * this.data.large_object.measurement.y,
      this.AXES_HELPER_RELATIVE_SIZE * this.data.large_object.measurement.z,
      this.AXES_HELPER_RELATIVE_SIZE * this.data.large_object.measurement.x
    )
    scene.add(axes)
  }

  _moveCamera (camera) {
    camera.position.set(
      this.CAMERA_ZOOM_OUT_ON_LOAD * this.data.large_object.measurement.y,
      this.CAMERA_ZOOM_OUT_ON_LOAD * this.data.large_object.measurement.z,
      this.CAMERA_ZOOM_OUT_ON_LOAD * this.data.large_object.measurement.x
    )
  }
}

export default Artist
