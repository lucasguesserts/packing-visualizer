import * as THREE from 'three'
import randomColor from 'randomcolor'
import OutputChecker from './check/OutputChecker.mjs'
import OutputConversor from './convert/output/OutputConversor.mjs'

const supportedOutputFileFormatVersion = '0.5.0'

class VisibilityController {
  constructor (slider, button) {
    this.slider = slider
    this.button = button
    this.reset()
    this.slider.oninput = () => {
      this._sliderSetVisibility()
    }
    this.button.onchange = () => {
      this._setEmptySpacesVisibility()
    }
  }

  addSmallItem (smallItem) {
    this.cuboid.push(smallItem.cuboid)
    this.edges.push(smallItem.edges)
    ++this.slider.max
    ++this.slider.value
  }

  addEmptySpaceSet (emptySpaceSet) {
    this.emptySpaceSet.push(emptySpaceSet)
  }

  reset () {
    this._resetSlider()
    this._resetButton()
    this._resetData()
  }

  _resetSlider () {
    this.slider.min = 0
    this.slider.value = 0
    this.slider.max = 0
    this.slider.step = 1
  }

  _resetButton () {
    this.button.checked = false
  }

  _resetData () {
    this.cuboid = []
    this.edges = []
    this.emptySpaceSet = []
  }

  _sliderSetVisibility () {
    this._setSmallItemsVisibility()
    this._setEmptySpacesVisibility()
  }

  _setSmallItemsVisibility () {
    // set small items visibility
    // small items before 'slider.value' are visible,
    for (let i = 0; i < this.slider.value; ++i) {
      this.cuboid[i].visible = true
      this.edges[i].visible = true
    }
    // small items after 'slider.value' are invisible
    for (let i = this.slider.value; i < this.slider.max; ++i) {
      this.cuboid[i].visible = false
      this.edges[i].visible = false
    }
  }

  _setEmptySpacesVisibility () {
    // set empty spaces visibility
    // previous empty spaces are not visible
    for (const emptySpaceSet of this.emptySpaceSet) {
      for (const emptySpace of emptySpaceSet) {
        emptySpace.cuboid.visible = false
      }
    }
    // current empty spaces are visible
    // if button is checked
    if (this.slider.value > 0) {
      for (const emptySpace of this.emptySpaceSet[this.slider.value - 1]) {
        emptySpace.cuboid.visible = this.button.checked
      }
    }
  }

  _buttonSetVisibility () {
    const currentEmptySpaceSet = this.emptySpaceSet[this.slider.value]
    for (const emptySpace of currentEmptySpaceSet) {
      emptySpace.visible = this.button.checked
    }
  }
}

class SmallItem {
  static MATERIAL = THREE.MeshToonMaterial
  static EDGE = {
    COLOR: 0x000000,
    LINE_WIDTH: 3
  }

  constructor (l, w, h, x, y, z) {
    this.cuboid = SmallItem.makeCuboid(l, w, h, x, y, z)
    this.edges = SmallItem.makeEdges(l, w, h, x, y, z)
  }

  draw (scene) {
    scene.add(this.cuboid)
    scene.add(this.edges)
  }

  static makeCuboid (l, w, h, x, y, z) {
    const geometry = new THREE.BoxGeometry(l, w, h)
    const material = new SmallItem.MATERIAL({
      emissive: randomColor({ luminosity: 'dark' }),
      side: THREE.DoubleSide
    })
    const cuboid = new THREE.Mesh(geometry, material)
    cuboid.position.set(
      x + l / 2,
      y + w / 2,
      z + h / 2
    )
    return cuboid
  }

  static makeEdges (l, w, h, x, y, z) {
    const cuboidGeometry = new THREE.BoxGeometry(l, w, h)
    const edgeGeometry = new THREE.EdgesGeometry(cuboidGeometry)
    const edgesMaterial = new THREE.LineBasicMaterial({
      color: SmallItem.EDGE.COLOR,
      linewidth: SmallItem.EDGE.LINE_WIDTH
    })
    const edges = new THREE.LineSegments(edgeGeometry, edgesMaterial)
    edges.position.set(
      x + l / 2,
      y + w / 2,
      z + h / 2
    )
    return edges
  }
}

class LargeObject {
  static MATERIAL = THREE.MeshToonMaterial
  static COLOR = 0xbbbbbb
  static EDGE = {
    COLOR: 0x000000,
    LINE_WIDTH: 3
  }

  constructor (l, w, h) {
    this.cuboid = LargeObject.makeCuboid(l, w, h)
    this.edges = LargeObject.makeEdges(l, w, h)
  }

  draw (scene) {
    scene.add(this.cuboid)
    scene.add(this.edges)
  }

  static makeCuboid (l, w, h) {
    const geometry = new THREE.BoxGeometry(l, w, h)
    const material = new LargeObject.MATERIAL({
      emissive: LargeObject.COLOR,
      side: THREE.BackSide
    })
    const cuboid = new THREE.Mesh(geometry, material)
    cuboid.position.set(l / 2, w / 2, h / 2)
    return cuboid
  }

  static makeEdges (l, w, h) {
    const cuboidGeometry = new THREE.BoxGeometry(l, w, h)
    const edgeGeometry = new THREE.EdgesGeometry(cuboidGeometry)
    const edgesMaterial = new THREE.LineBasicMaterial({
      color: LargeObject.EDGE.COLOR,
      linewidth: LargeObject.EDGE.LINE_WIDTH
    })
    const edges = new THREE.LineSegments(edgeGeometry, edgesMaterial)
    edges.position.set(l / 2, w / 2, h / 2)
    return edges
  }
}

class EmptySpace {
  static MATERIAL = THREE.MeshToonMaterial

  constructor (l, w, h, x, y, z) {
    this.cuboid = EmptySpace.makeCuboid(l, w, h, x, y, z)
  }

  draw (scene) {
    scene.add(this.cuboid)
  }

  static makeCuboid (l, w, h, x, y, z) {
    const geometry = new THREE.BoxGeometry(l, w, h)
    const material = new EmptySpace.MATERIAL({
      emissive: randomColor({
        luminosity: 'light'
      }),
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5
    })
    const cuboid = new THREE.Mesh(geometry, material)
    cuboid.visible = false
    cuboid.position.set(
      x + l / 2,
      y + w / 2,
      z + h / 2
    )
    return cuboid
  }
}

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

export { SmallItem, LargeObject, EmptySpace, Artist, Reader, VisibilityController }
