import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import * as Draw from './draw/draw.mjs'

import InputChecker from './check/InputChecker.mjs'

// scene, camera, render
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  preserveDrawingBuffer: true,
  alpha: true
})
const slider = document.getElementById('slideRange')
const emptySpacesButton = document.getElementById('display-empty-space')
const visibilityController = new Draw.VisibilityController(slider, emptySpacesButton)
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setClearColor(0x8c92ac, 1)
document.body.appendChild(renderer.domElement)

// draw
const drawFileSelector = document.getElementById('draw-file-selector')
const drawReader = new Draw.Reader(drawFileSelector)
drawReader.setup((data) => {
  const artist = new Draw.Artist(data)
  artist.draw(scene, camera, visibilityController)
})

// check input
const inputCheckFileSelector = document.getElementById('check-input-file-selector')
const inputCheckReader = new Draw.Reader(inputCheckFileSelector)
inputCheckReader.setup((data) => {
  InputChecker.check(data)
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
  requestAnimationFrame(animate) // eslint-disable-line no-undef
  controls.update()
  renderer.render(scene, camera)
}
animate()
