import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import * as Draw from './draw.js'

import InputChecker from './check/InputChecker.js'

// scene, camera, render
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  preserveDrawingBuffer: true,
  alpha: true
})
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setClearColor(0x8c92ac, 1)
document.body.appendChild(renderer.domElement)

// large object and small items
const fileSelector = document.getElementById('file-selector')
fileSelector.addEventListener('change', (event) => {
  const fileList = event.target.files
  Draw.FileLoader.read(fileList[0], scene, camera)
})

// check input
const checkInput = document.getElementById('check-input')
checkInput.addEventListener('change', (event) => {
  const file = event.target.files[0]
  if (file.type && !file.type.endsWith('json')) {
    console.log('File is not a json.', file.type, file)
    return
  }
  const reader = new FileReader()
  reader.addEventListener('load', (event) => {
    const data = JSON.parse(event.target.result)
    InputChecker.check(data)
  })
  reader.readAsText(file)
})

// orbit controls
const controls = new OrbitControls(camera, renderer.domElement)
controls.update()

// axes
const axes = new THREE.AxesHelper()
axes.scale.set(10, 10, 10)
scene.add(axes)

// window resize
// https://jsfiddle.net/92sap05q/1/
const tanFOV = Math.tan(((Math.PI / 180) * camera.fov / 2))
const windowHeight = window.innerHeight
window.addEventListener('resize', onWindowResize, false)

function onWindowResize (event) {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.fov = (360 / Math.PI) * Math.atan(tanFOV * (window.innerHeight / windowHeight))
  camera.updateProjectionMatrix()
  camera.lookAt(scene.position)
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.render(scene, camera)
}

function animate () {
  requestAnimationFrame(animate)
  controls.update()
  renderer.render(scene, camera)
}
animate()
