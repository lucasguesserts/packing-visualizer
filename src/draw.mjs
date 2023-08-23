import * as THREE from 'three'
import randomColor from 'randomcolor'
import OutputChecker from './check/OutputChecker.mjs'
import OutputConversor from './convert/output/OutputConversor.mjs'

const supportedOutputFileFormatVersion = '0.4.0'

class Slider {
  constructor (slider) {
    this.slider = slider
    this.slider.min = 0
    this.object = {}
    this.object.cuboid = []
    this.object.edges = []
    this.slider.oninput = () => {
      this._setVisibility()
    }
  }

  addSmallItem (smallItem) {
    this.object.cuboid.push(smallItem.cuboid)
    this.object.edges.push(smallItem.edges)
    ++this.slider.max
    ++this.slider.value
  }

  reset () {
    this.slider.value = 0
    this.slider.max = 0
    this.object.cuboid = []
    this.object.edges = []
  }

  _setVisibility () {
    for (let i = 0; i < this.slider.value; ++i) {
      this.object.cuboid[i].visible = true
      this.object.edges[i].visible = true
    }
    for (let i = this.slider.value; i < this.slider.max; ++i) {
      this.object.cuboid[i].visible = false
      this.object.edges[i].visible = false
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

  draw (scene, slider, camera) {
    slider.reset()
    this._cleanScene(scene)
    this._addLargeObject(scene)
    this._addSmallItems(scene, slider)
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

export { Slider, SmallItem, LargeObject, Artist }
