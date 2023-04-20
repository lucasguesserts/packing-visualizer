import * as THREE from 'three'

function getRandomColor() {
  return Math.random() * 0x666666
}

class SmallItem {
  static MATERIAL = THREE.MeshToonMaterial
  static EDGE = {
    COLOR: 0x000000,
    LINE_WIDTH: 3
  }

  constructor(l, w, h, x, y, z) {
    this.cuboid = SmallItem.makeCuboid(l, w, h, x, y, z)
    this.edges = SmallItem.makeEdges(l, w, h, x, y, z)
    return
  }

  draw(scene) {
    scene.add(this.cuboid)
    scene.add(this.edges)
    return
  }

  static makeCuboid(l, w, h, x, y, z) {
    const geometry = new THREE.BoxGeometry(l, w, h)
    const material = new SmallItem.MATERIAL({
      emissive: getRandomColor(),
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

  static makeEdges(l, w, h, x, y, z) {
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
  static EDGE = {
    COLOR: 0x000000,
    LINE_WIDTH: 3
  }

  constructor(l, w, h) {
    this.cuboid = LargeObject.makeCuboid(l, w, h)
    this.edges = LargeObject.makeEdges(l, w, h)
    return
  }

  draw(scene) {
    scene.add(this.cuboid)
    scene.add(this.edges)
    return
  }

  static makeCuboid(l, w, h) {
    const geometry = new THREE.BoxGeometry(l, w, h)
    const material = new LargeObject.MATERIAL({
      emissive: 0xbbbbbb,
      side: THREE.BackSide
    })
    const cuboid = new THREE.Mesh(geometry, material)
    cuboid.position.set(l / 2, w / 2, h / 2)
    return cuboid
  }

  static makeEdges(l, w, h) {
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

export { SmallItem, LargeObject }
