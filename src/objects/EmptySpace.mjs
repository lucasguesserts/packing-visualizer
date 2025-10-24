import * as THREE from 'three'

class EmptySpace {
  static MATERIAL = THREE.MeshToonMaterial

  constructor (l, w, h, x, y, z, c) {
    this.cuboid = EmptySpace.makeCuboid(l, w, h, x, y, z, c)
  }

  draw (scene) {
    scene.add(this.cuboid)
  }

  static makeCuboid (l, w, h, x, y, z, c) {
    const geometry = new THREE.BoxGeometry(l, w, h)
    const material = new EmptySpace.MATERIAL({
      emissive: c,
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

export default EmptySpace
