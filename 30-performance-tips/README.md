# Performance tips

[![Difficulty: Medium](https://img.shields.io/badge/Difficulty-Medium-yellow.svg)](https://shields.io)

Learn in [https://threejs-journey.xyz/lessons/30](https://threejs-journey.xyz/lessons/30)

## Introduction

As we said in one of the first lessons, you should target a 60fps experience, at least. Some users might even have configurations where the experience should run at a higher frame rate. Those are usually gamers and are even more exigent in terms of performances and frame rate.

There can be two main limitations:

- The CPU
- The GPU

You need to keep an eye on the performances and test across multiple devices with different setups and don't forget mobile devices if your website is supposed to be compatible with those.

It would help if you also kept an eye on the overall weight of the website. When we are developing in local, things load remarkably fast, but once online, it depends on the user connection and the server speed. We need to keep the assets as light as possible.

There are many tips to improve both performances and weight, and we've already seen most of them, but here's an exhaustive list.

## Setup

Some of the following tips have code examples in the starter, and each tip has a number. Uncomment the corresponding code part if you want to test it.

## Monitoring

First, we need to measure the performance and not just eyeball it.

### 1 - Monitor FPS

Chrome used to have a nice FPS meter but they replaced but not anymore. Instead, we can use a JavaScript FPS meter like [stats.js](https://github.com/mrdoob/stats.js/).

Add it to the dependencies with `npm install --save stats.js`.

Import it and instantiate it

```js
import Stats from 'stats.js'

const stats = new Stats()
stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom)
```

Call it's `begin()` and `end()` methods in the `tick` function

```js
const tick = () =>
{
    stats.begin()

    // ...

    stats.end()
}
```

You should get a nice looking FPS meter.

### 2 - Disable FPS limit

There is a way to unlock Chrome frame rate regardless of the screen capabilities.

That will enable frame rate monitoring even on good computers. For example, if you are developing on a good computer and you see `60fps`, you might think it's okay. But maybe your website can only run at `70~80fps` on that good computer, but the frame rate will drop below `60fps` on other computers, and you won't know it.

If you unlock the frame rate limit, you'll see that the performances aren't good enough, and you should run at something like `150~200fps` on this computer to be safe.

To unlock Chrome framerate:

- Close it completely —right the following instructions somewhere else if you are looking at this lesson on Chrome.
- Open the terminal.
- Open the following Github gist and launch the right command —Mac or Windows: [https://gist.github.com/brunosimon/c15e7451a802fa8e34c0678620022f7d](https://gist.github.com/brunosimon/c15e7451a802fa8e34c0678620022f7d)

Chrome should open without the frame rate limit. You can test it on with the exercise by opening the **FPS meter** again. If it didn't work, close it and retry. If it still doesn't work, you'll have to do without it.

Be careful; doing this will draw much more power from your computer and might result on Chrome crashing.

### 3 - Monitoring draw calls

Draw calls are actions of drawing triangles by the GPU. There will be many draw calls when we have a complex scene with many objects, geometries, materials, etc.

Usually, we can say that the less draw calls you have, the better. We will see some tips to reduce these, but first, we would like to monitor them.

There is a great Chrome extension named **Spector.js** that can help you with that.

- Install the extension: [https://chrome.google.com/webstore/detail/spectorjs/denbgaamihkadbghdceggmchnflmhpmk](https://chrome.google.com/webstore/detail/spectorjs/denbgaamihkadbghdceggmchnflmhpmk)
- On the WebGL page, click on the extension icon to activate it.
- Click again to open the extension panel.
- Click on the red circle to record the frame.

Wait a little, and a new page will open with many intricate details about the recorded frame.

In the **Commands** tab, you'll see how the frame has been drawn step by step. We won't explain everything here, but the blue steps are draw calls, and the other steps are usually data sent to the GPU such as the matrices, attributes, uniforms, etc.

The less you have, the better.

### 4 - Renderer informations

The `renderer` can provide some information about what's in the scene and what's being drawn.

Just log the `renderer.info` to get this information:

```js
console.log(renderer.info)
```

## General

### 5 - Good JavaScript code

This one goes without saying, but we must keep a performant native JavaScript code. That is even more important in the `tick` function because this one will be called on each frame.

### 6 - Dispose of things

Once you are absolutely sure you don't need a resource like a geometry or a material, dispose of it. If you create a game with levels, once the user goes to the next level, dispose of things from the previous level.

To do that, there is a dedicated page on the Three.js documentation: [https://threejs.org/docs/#manual/en/introduction/How-to-dispose-of-objects](https://threejs.org/docs/#manual/en/introduction/How-to-dispose-of-objects)

Here's an example with the cube:

```js
scene.remove(cube)
cube.geometry.dispose()
cube.material.dispose()
```

## Lights

### 7 - Avoid them

If possible, try to avoid using Three.js lights. These are useful and simple to use, but they can steadily suck the computer's performance.

If you don't have a choice, try to use as few lights as possible and use the cheapest ones like the [AmbientLight](https://threejs.org/docs/#api/en/lights/AmbientLight) or the [DirectionalLight](https://threejs.org/docs/#api/en/lights/DirectionalLight)

### 8 - Avoid adding or removing lights

When you add or remove light from the scene, all the materials supporting lights will have to be recompiled. That is how Three.js works, and this can freeze the screen for a moment if you have a complex scene.

## Shadows

### 9 - Avoid them

Like the lights, shadows are handy, but they are bad for performances. Avoid them and try to find alternatives like baked shadows — for instance when the shadow is directly in the texture.

### 10 - Optimize shadow maps

If you don't have any other choice, try to optimize the shadow maps so they look good but fit perfectly with the scene.

Use the [CameraHelper](https://threejs.org/docs/#api/en/helpers/CameraHelper) to see the area that will be renderer by the shadow map camera and reduce it to the smallest area possible:

```js
directionalLight.shadow.camera.top = 3
directionalLight.shadow.camera.right = 6
directionalLight.shadow.camera.left = - 6
directionalLight.shadow.camera.bottom = - 3
directionalLight.shadow.camera.far = 10

const cameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
scene.add(cameraHelper)
```

Also try to use the smallest possible resolution with a descent result for the `mapSize`:

```js
directionalLight.shadow.mapSize.set(1024, 1024)
```

### 11 - Use castShadow and receiveShadow wisely

Some objects can cast shadows, some objects can receive shadows, and some might do both. Try to activate `castShadow` and `receiveShadow` on as few objects as possible:

```js
cube.castShadow = true
cube.receiveShadow = false

torusKnot.castShadow = true
torusKnot.receiveShadow = false

sphere.castShadow = true
sphere.receiveShadow = false

floor.castShadow = false
floor.receiveShadow = true
```

### 12 - Deactivate shadow auto update

Currently, shadow maps get updated before each render. You can deactivate this auto-update and alert Three.js that the shadow maps needs update only when necessary:

```js
renderer.shadowMap.autoUpdate = false
renderer.shadowMap.needsUpdate = true
```

As you can see, we don't see the `torusKnot` shadow rotating anymore.

## Textures

### 13 - Resize textures

Textures take a lot of space in the GPU memory. It's even worst with the mipmaps (the automatically generated smaller versions for minification filtering and magnification filtering).

The texture file weight has nothing to do with that, and only the resolution matters.

Try to reduce the resolution to the minimum while keeping a decent result.

### 14 - Keep a power of 2 resolutions

When resizing, remember to keep a power of 2 resolution. That is important for mipmaps.

The resolution doesn't have to be a square; you can have a width different from the height.

If you don't do this and the render needs the mipmap, Three.js will try to fix it by resizing the image to the closest power of 2 resolution, but this process will take resources and might result in bad quality textures.

### 15 - Use the right format

We said that the format doesn't change the memory usage on the GPU, but using the right format may reduce the loading time.

You can use `.jpg` or `.png` according to the image and the compression but also the alpha channel.

You can use online tools like [TinyPNG](https://tinypng.com/) to reduce the weight even more. And you can also try special formats like basis.

Basis is a format just like `.jpg` and `.png` but the compression is powerful, and the format can be read by the GPU more easily. We won't cover it because it's pretty hard to generate, but give it a try if you want. You can find information and tools to create `.basis` files here: [https://github.com/BinomialLLC/basis_universal](https://github.com/BinomialLLC/basis_universal)

## Geometries

### 16 - Use BufferGeometries

Always use buffer geometries instead of classic geometries. They are harder to use when we want to change the vertices, but they are more performant.

Since the 125th version of Three.js, those classic geometries have been removed. When using geometries like a `BoxGeometry`, you are already using buffer geometries.

### 17 - Do not update vertices

Updating the vertices of a geometry is terrible for the performances. You can do it once when you create the geometry, but avoid doing it in the `tick` function.

If you need to animate the vertices, do it with a vertex shaders.

### 18 - Mutualize geometries

If you have multiple [Meshes](https://threejs.org/docs/#api/en/objects/Mesh) using the same geometry shape, create only one geometry, and use it on all the meshes:

```js
// Tip 17
const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)

for(let i = 0; i < 50; i++)
{
    const material = new THREE.MeshNormalMaterial()

    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.x = (Math.random() - 0.5) * 10
    mesh.position.y = (Math.random() - 0.5) * 10
    mesh.position.z = (Math.random() - 0.5) * 10
    mesh.rotation.y = (Math.random() - 0.5) * Math.PI * 2
    mesh.rotation.z = (Math.random() - 0.5) * Math.PI * 2

    scene.add(mesh)
}
```

You can still change the [Mesh](https://threejs.org/docs/#api/en/objects/Mesh) position, rotation and scale.

### 19 - Merge geometries

If the geometries aren't supposed to move, you can also merge them by using the [BufferGeometryUtils](https://threejs.org/docs/#examples/en/utils/BufferGeometryUtils). This class isn't available by default, and we need to import it:

```js
import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
```

We don't need to instantiate it, and we can use its methods directly.

Use the `mergeBufferGeometries(...)` method with an array of geometries as parameter to get one merged geometry in return. We can then use that geometry with a single [Mesh](https://threejs.org/docs/#api/en/objects/Mesh):

```js
const geometries = []
for(let i = 0; i < 50; i++)
{
    const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)

    geometry.rotateX((Math.random() - 0.5) * Math.PI * 2)
    geometry.rotateY((Math.random() - 0.5) * Math.PI * 2)

    geometry.translate(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
    )

    geometries.push(geometry)
}

const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(geometries)
console.log(mergedGeometry)

const material = new THREE.MeshNormalMaterial()

const mesh = new THREE.Mesh(mergedGeometry, material)
scene.add(mesh)
```

That is harder because we have to twist the way we create things and move all the meshes transformations into the geometries, but this worth it because, in the end, we only have one draw call.

## Materials

### 20 - Mutualize materials

Like for the geometries, if you are using the same type of material for multiple meshes, try to create only one and use it multiple times:

```js
const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)

const material = new THREE.MeshNormalMaterial()

for(let i = 0; i < 50; i++)
{
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.x = (Math.random() - 0.5) * 10
    mesh.position.y = (Math.random() - 0.5) * 10
    mesh.position.z = (Math.random() - 0.5) * 10
    mesh.rotation.x = (Math.random() - 0.5) * Math.PI * 2
    mesh.rotation.y = (Math.random() - 0.5) * Math.PI * 2

    scene.add(mesh)
}
```

### 21 - Use cheap materials

Some materials like [MeshStandardMaterial](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial) or [MeshPhysicalMaterial](https://threejs.org/docs/#api/en/materials/MeshPhysicalMaterial) need more resources than materials such as [MeshBasicMaterial](https://threejs.org/docs/#api/en/materials/MeshBasicMaterial), [MeshLambertMaterial](https://threejs.org/docs/#api/en/materials/MeshLambertMaterial) or [MeshPhongMaterial](https://threejs.org/docs/#api/en/materials/MeshPhongMaterial).

Try to use the cheapest materials when you can.

## Meshes

### 22 - Use InstancedMesh

If you cannot merge the geometries because you need to have control over the meshes independently, but they are using the same geometry and same material, you can use an [InstancedMesh](https://threejs.org/docs/#api/en/objects/InstancedMesh).

It's like a mesh, but you create only one [InstancedMesh](https://threejs.org/docs/#api/en/objects/InstancedMesh), and then you provide a transformation matrix for each "instance" of that mesh.

The matrix has to be a [Matrix4](https://threejs.org/docs/#api/en/math/Matrix4), and you can apply any transformation by using the various available methods:

```js
const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)

const material = new THREE.MeshNormalMaterial()

const mesh = new THREE.InstancedMesh(geometry, material, 50)
scene.add(mesh)

for(let i = 0; i < 50; i++)
{
    const position = new THREE.Vector3(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
    )

    const quaternion = new THREE.Quaternion()
    quaternion.setFromEuler(new THREE.Euler((Math.random() - 0.5) * Math.PI * 2, (Math.random() - 0.5) * Math.PI * 2, 0))

    const matrix = new THREE.Matrix4()
    matrix.makeRotationFromQuaternion(quaternion)
    matrix.setPosition(position)

    mesh.setMatrixAt(i, matrix)
}
```

We get a result almost as good as merge geometries, but we can still move the meshes by changing the matrices.

If you intend to change these matrices in the `tick` function, add this to the [InstancedMesh](https://threejs.org/docs/#api/en/objects/InstancedMesh):

```js
mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
```

## Models

### 23 - Low poly

Use low poly models. The fewer polygons, the better the frame rate. If you need details, try to use normal maps. They are cheap in terms of performances and can get you great details at the texture cost.

### 24 - Draco compression

If the model has a lot of details with very complex geometries, use the Draco compression. It can reduce weight drastically. The drawbacks are a potential freeze when uncompressing the geometry, and you also have to load the Draco libraries.

### 25 - Gzip

Gzip is a compression happening on the server side. Most of the servers don't gzip files such as `.glb`, `.gltf`, `.obj`, etc.

See if you can figure out how to fix that, depending on the server you are using.

## Cameras

### 26 - Field of view

When objects are not in the field of view, they won't be rendered. That is called frustum culling.

That can seem like a tawdry solution, but you can just reduce the camera's field of view. The fewer objects on the screen, the fewer triangles to render.

### 27 - Near and far

Just like the field of view, you can reduce the `near` and `far` properties of the camera. If you have a vast world with mountains, trees, structures, etc., the user probably can't see those small houses out of sight far behind the mountains. Reduce the `far` to a decent value and those houses won't even try to be rendered.

## Renderer

### 29 - Pixel ratio

Some devices have a very high pixel ratio. It's just a marketing argument, but the more pixels to render, to worst the frame rate.

Try to limit the pixel ratio of the renderer to something like `2`:

```js
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
```

### 30 - Power preferences

Some devices may be able to switch between different GPU or different GPU usage. We can give a hint on what power is required when instantiating the [WebGLRenderer](https://threejs.org/docs/#api/en/renderers/WebGLRenderer) by specifying a `powerPreference` property:

```js
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    powerPreference: 'high-performance'
})
```

If you don't have performance issues, set this property to `'default'`.

### 31 - Antialias

The default antialias is performant, but still, it's less performant than no antialias. Only add it if you have visible aliasing and no performance issue.

## Postprocessing

### 32 - Limit passes

Each post-processing pass will take as many pixels as the render's resolution (including the pixel ratio) to render. If you have a `1920x1080` resolution with 4 passes and a pixel ratio of `2`, that makes `1920 * 2 * 1080 * 2 * 4 = 33&nbsp;177&nbsp;600` pixels to render. Be reasonable, and try to regroup your custom passes into one.

## Shaders

### 31 - Specify the precision

You can force the precision of the shaders in the materials by changing their `precision` property:

```js
const shaderMaterial = new THREE.ShaderMaterial({
    precision: 'lowp',
    // ...
})
```

Check the result for any quality downgrade or glitches.

That won't work with the [RawShaderMaterial](https://threejs.org/docs/#api/en/materials/RawShaderMaterial), and you'll have to add the `precision` by yourself on the shaders like we did on the first shaders lesson.

### 32 - Keep code simple

It's laborious to monitor the difference, but try to keep your shader codes as simple as possible. Avoid `if` statements. Make good use of swizzles and built-in functions.

As in the vertex shader, instead of the `if` statement:

```glsl
modelPosition.y += clamp(elevation, 0.5, 1.0) * uDisplacementStrength;
```

Or as in the fragment shader, instead of these complex formulas for `r`, `g` and `b`:

```glsl
vec3 depthColor = vec3(1.0, 0.1, 0.1);
vec3 surfaceColor = vec3(0.1, 0.0, 0.5);
vec3 finalColor = mix(depthColor, surfaceColor, elevation);
```

### 33 - Use textures

Employing perlin noise functions is cool, but it can affect your performance considerably. Sometimes, you better use a texture representing the noise. Using `texture2D()` is way cheaper than a perlin noise function, and you can produce these textures quite efficiently with tools like photoshop.

### 34 - Use defines

Uniforms are beneficial because we can tweak them and animate the values in the JavaScript. But uniforms have a performance cost. If the value isn't supposed to change, you can use defines. There are two ways of creating a `define`.

Directly in the shader code:

```glsl
#define uDisplacementStrength 1.5
```

Or in the `defines` property of the [ShaderMaterial](https://threejs.org/docs/#api/en/materials/ShaderMaterial):

```js
const shaderMaterial = new THREE.ShaderMaterial({

    // ...

    defines:
    {
        uDisplacementStrength: 1.5
    },

    // ...
}
```

Those `defines` will automatically be added to the GLSL code if you are using a [ShaderMaterial](https://threejs.org/docs/#api/en/materials/ShaderMaterial).

### 35 - Do the calculations in the vertex shader

If possible, do the calculations in the vertex shader and send the result to the fragment shader.

## Go further

Keep an eye on the performances from the start. Test on other devices, use the tools we saw initially and fix any strange behavior before going further.

Each project will have different constraints, and applying those tips won't always suffice. Try to find solutions. Twist the way you are doing things. Be smart.

You'll find a better way of doing things throughout your projects, and you'll adapt more quickly. At a point, you'll even know multiple ways of getting the same result, and you'll have the luxury to pick the best one.

Here is another big list of tips to improve how you use Three.js by [Lewy Blue](https://twitter.com/lewy_blue): [https://discoverthreejs.com/tips-and-tricks/](https://discoverthreejs.com/tips-and-tricks/)
