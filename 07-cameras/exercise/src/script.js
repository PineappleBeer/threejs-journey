import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
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
let controls = null
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
  {
    name: 'OrbitControls',
    handler: () => {
      camera = perspectiveCamera
      camera.position.x = 2
      camera.position.y = 2
      camera.position.z = 2
      camera.lookAt(mesh.position)

      // Controls
      controls = new OrbitControls(camera, canvas)
      controls.enableDamping = true
    },
    dispose: () => {
      if (controls) controls.dispose()
      controls = null
    },
  },
])

// Animate
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update objects
  if (exerciseMode.is('Custom Controls')) {
    camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 2
    camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 2
    camera.position.y = cursor.y * 3
    camera.lookAt(mesh.position)
  } else if (exerciseMode.is('OrbitControls')) {
    controls.update()
  } else {
    mesh.rotation.y = elapsedTime
  }

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
