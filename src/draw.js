import * as THREE from 'three'
import randomColor from 'randomcolor'
import OutputChecker from './check_output'

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

class FileLoader {
  static CAMERA_ZOOM_OUT_ON_LOAD = 1.5
  static AXES_HELPER_RELATIVE_SIZE = 3

  static read (file, scene, camera) {
    if (file.type && !file.type.endsWith('json')) {
      console.log('File is not a json.', file.type, file)
      return
    }
    const reader = new FileReader()
    reader.addEventListener('load', (event) => {
      const data = JSON.parse(event.target.result)
      OutputChecker.check(data)
      FileLoader.cleanScene(scene)
      FileLoader.draw(data, scene)
      FileLoader.moveCamera(data, camera)
      FileLoader.addAxes(data, scene)
    })
    reader.readAsText(file)
  }

  static cleanScene (scene) {
    while (scene.children.length > 0) {
      scene.remove(scene.children[0])
    }
  }

  static draw (data, scene) {
    const largeObject = new LargeObject(
      data.large_object.width,
      data.large_object.height,
      data.large_object.length
    )
    largeObject.draw(scene)
    for (const item of data.small_items) {
      const smallItem = new SmallItem(
        item.width,
        item.height,
        item.length,
        item.y,
        item.z,
        item.x
      )
      smallItem.draw(scene)
    }
  }

  static moveCamera (data, camera) {
    camera.position.set(
      FileLoader.CAMERA_ZOOM_OUT_ON_LOAD * data.large_object.width,
      FileLoader.CAMERA_ZOOM_OUT_ON_LOAD * data.large_object.height,
      FileLoader.CAMERA_ZOOM_OUT_ON_LOAD * data.large_object.length
    )
  }

  static addAxes (data, scene) {
    const axes = new THREE.AxesHelper()
    axes.scale.set(
      FileLoader.AXES_HELPER_RELATIVE_SIZE * data.large_object.width,
      FileLoader.AXES_HELPER_RELATIVE_SIZE * data.large_object.height,
      FileLoader.AXES_HELPER_RELATIVE_SIZE * data.large_object.length
    )
    scene.add(axes)
  }
}

export { SmallItem, LargeObject, FileLoader }
