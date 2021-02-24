import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { generateExerciseModes } from '../../../utils'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * BoxGeometry
 */
const boxGeometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2)

/**
 * BufferGeometry
 */
const bufferGeometry = new THREE.BufferGeometry()
const positionsArray = new Float32Array(9)

// First vertice
positionsArray[0] = 0
positionsArray[1] = 0
positionsArray[2] = 0

// Second vertice
positionsArray[3] = 0
positionsArray[4] = 1
positionsArray[5] = 0

// Third vertice
positionsArray[6] = 1
positionsArray[7] = 0
positionsArray[8] = 0

/* Or
const positionsArray = new Float32Array([
  0, 0, 0, // First vertex
  0, 1, 0, // Second vertex
  1, 0, 0  // Third vertex
])
*/

const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3) // number 3 mean one vertice use 3 value in array (position x, y, z)
bufferGeometry.setAttribute('position', positionsAttribute)

// Exercise modes
let geometry = null
const material = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  wireframe: true,
})
generateExerciseModes(
  [
    {
      name: 'Box example',
      handler: () => {
        geometry = boxGeometry
      },
    },
    {
      name: 'Own buffer geometry',
      handler: () => {
        geometry = bufferGeometry
      },
    },
  ],
  {
    before: () => {
      scene.clear()
    },
    after: () => {
      const mesh = new THREE.Mesh(geometry, material)
      scene.add(mesh)
    },
  }
)

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Animate
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
