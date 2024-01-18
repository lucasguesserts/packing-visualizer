import * as THREE from 'three'

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

export default LargeObject
