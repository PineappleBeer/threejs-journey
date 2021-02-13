import './style.css'
import * as THREE from 'three'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Axes helper
 */
const axesHelper = new THREE.AxesHelper()
scene.add(axesHelper)

/**
 * Objects
 */
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)

// Position
mesh.position.x = 0.7
mesh.position.y = -0.6
mesh.position.z = 1
// or `mesh.position.set(0.7, -0.6, 1)`

// Scale
mesh.scale.x = 2
mesh.scale.y = 0.25
mesh.scale.z = 0.5
// or `mesh.scale.set(2, 0.25, 0.5)`

// Rotation
mesh.rotation.reorder('YXZ') // reorder before changing the rotation (default: 'XYZ')
mesh.rotation.x = Math.PI * 0.25
mesh.rotation.y = Math.PI * 0.25
// or `mesh.rotation.set(Math.PI * 0.25, Math.PI * 0.25, 0)`

scene.add(mesh)

/**
 * Sizes
 */
const sizes = {
  width: 800,
  height: 600,
}

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

// Look at
camera.lookAt(mesh.position)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)
