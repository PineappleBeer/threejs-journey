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
perspectiveCamera.position.x = 2
perspectiveCamera.position.y = 2
perspectiveCamera.position.z = 2
perspectiveCamera.lookAt(mesh.position)
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
orthographicCamera.position.x = 2
orthographicCamera.position.y = 2
orthographicCamera.position.z = 2
orthographicCamera.lookAt(mesh.position)
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
    },
  },
  {
    name: 'OrthographicCamera',
    handler: () => {
      camera = orthographicCamera
    },
  },
])

// Animate
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update objects
  mesh.rotation.y = elapsedTime

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
