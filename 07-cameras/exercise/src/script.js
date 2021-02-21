import './style.css'
import * as THREE from 'three'
import { generateExerciseModes } from '../../../utils'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Sizes
const sizes = {
  width: 800,
  height: 600,
}

// Cursor
const cursor = { x: 0, y: 0 }
window.addEventListener('mousemove', event => {
  cursor.x = event.clientX / sizes.width - 0.5
  cursor.y = event.clientY / sizes.height - 0.5
})

// Scene
const scene = new THREE.Scene()

// Object
const mesh = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1, 5, 5, 5),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
scene.add(mesh)

// PerspectiveCamera
const perspectiveCamera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
)
scene.add(perspectiveCamera)

// OrthographicCamera
const aspectRatio = sizes.width / sizes.height
const orthographicCamera = new THREE.OrthographicCamera(
  -1 * aspectRatio,
  1 * aspectRatio,
  1,
  -1,
  0.1,
  100
)
scene.add(orthographicCamera)

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
})
renderer.setSize(sizes.width, sizes.height)

// Exercise modes
let camera = null
const exerciseMode = generateExerciseModes([
  {
    name: 'PerspectiveCamera',
    handler: () => {
      camera = perspectiveCamera
      camera.position.x = 2
      camera.position.y = 2
      camera.position.z = 2
      camera.lookAt(mesh.position)
    },
  },
  {
    name: 'OrthographicCamera',
    handler: () => {
      camera = orthographicCamera
      camera.position.x = 2
      camera.position.y = 2
      camera.position.z = 2
      camera.lookAt(mesh.position)
    },
  },
  {
    name: 'Custom Controls',
    handler: () => {
      camera = perspectiveCamera
      camera.position.x = 0
      camera.position.y = 0
      camera.position.z = 3
      camera.lookAt(mesh.position)
    },
  },
])

// Animate
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update objects
  mesh.rotation.y = elapsedTime
  if (exerciseMode.is('Custom Controls')) {
    camera.position.x = cursor.x
    camera.position.y = cursor.y
  }

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
