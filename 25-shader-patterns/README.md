# Shader patterns

[![Difficulty: Hard](https://img.shields.io/badge/Difficulty-Hard-orange.svg)](https://shields.io)

Learn in [https://threejs-journey.xyz/lessons/25](https://threejs-journey.xyz/lessons/25)

## Introduction

Often, while creating shaders, we need to draw specific patterns like stars, circles, light lenses, waves, etc.

It can help to effectively see those pattern on a geometry or it can be to move the vertices just like we did with the flag in the previous lesson.

We could use textures but drawing the shape gives us more control; we can animate the shape parameters, and there is no texture to load.

It's much more complicated than drawing with other APIs like canvas because the code is the same for every fragment, and all we have are coordinates and our mathematical skills.

Yes, there will be some maths in this lesson. It's one of the most frustrating parts for some people but fear not; even if you are doing poorly with maths, you'll find a solution.

In this lesson, we will try to draw various patterns on a plane. We will start very thoroughly, and things will get more challenging with time. It's the perfect occasion to discover classic technics and use built-in functions.

For each pattern, we first study the result; then, we try to reproduce it. If you want to get better at this, pause the lesson on each pattern and try to do it yourself. Even if you fail, the solution will make more sense if you tried on you own.

## Setup

Currently, we only have one plane on the scene with a [ShaderMaterial](https://threejs.org/docs/#api/en/materials/ShaderMaterial) as a [PlaneGeometry](https://threejs.org/docs/index.html#api/en/geometries/PlaneGeometry). As a reminder, [ShaderMaterial](https://threejs.org/docs/#api/en/materials/ShaderMaterial) is like [RawShaderMaterial](https://threejs.org/docs/#api/en/materials/RawShaderMaterial), with some code prepended to the shaders like importing the matrices, importing some attributes, or setting the precision.

![step-01](./files/step-01.png)

## Send the UV coordinates to the fragment

Because we will draw the plane patterns, most of our code will be in the fragment shader. But first, we need to send the UV coordinates from the vertex shader to that fragment shader.

To retrieve the `uv` attribute in the vertex shader, we should have written something like this:

```glsl
attribute vec2 uv;
```

But because we are using a [ShaderMaterial](https://threejs.org/docs/#api/en/materials/ShaderMaterial), this code is already prepended to the vertex shader.

To send this value from the vertex shader to the fragment shader, we need a `varying`. We are going to call it `vUv` and assign it with the `uv`:

```glsl
varying vec2 vUv;

void main()
{
    // ...

    vUv = uv;
}
```

In the fragment shader, we can retrieve this `vUv` varying with the same declaration:

```glsl
varying vec2 vUv;

void main()
{
    // ...
}
```

We now have access to the `uv` coordinates in our fragment shader as `vUv`. The values go from `0, 0` on the bottom-left corner to `1, 1` on the top-right corner.

## Pattern 1

![base-01](./files/base-01.png)

This lovely color pattern is the easiest one to get. We just need to use the `vUv` in the `gl_FragColor` with the blue value being `1.0`:

```glsl
varying vec2 vUv;

void main()
{
    gl_FragColor = vec4(vUv, 1.0, 1.0);
}
```

## Pattern 2

![base-02](./files/base-02.png)

This is exactly the same pattern but with the blue value being `0.0`:

```glsl
varying vec2 vUv;

void main()
{
    gl_FragColor = vec4(vUv, 0.0, 1.0);
}
```

## Pattern 3

![base-03](./files/base-03.png)

Things get a little more interesting here. To get this gradient, we only use the `x` property of the `vUv`, but in all first three values of `gl_FragColor`:

```glsl
varying vec2 vUv;

void main()
{
    gl_FragColor = vec4(vUv.x, vUv.x, vUv.x, 1.0);
}
```

From now, we are going to draw black and white patterns like this. Instead of sending the value on `r`, `g`, and `b` separately, we can create a `float` variable named `strength`:

```glsl
varying vec2 vUv;

void main()
{
    float strength = vUv.x;

    gl_FragColor = vec4(vec3(strength), 1.0);
}
```

We will now focus on the `strength` variable and try to draw the following patterns.

Instead of replacing your previous patterns, you can comment so you can get back to them later.

## Pattern 4

![base-04](./files/base-04.png)

This pattern is exactly the same but on the `y` axis:

```glsl
float strength = vUv.y;
```

## Pattern 5

![base-05](./files/base-05.png)

This pattern is exactly the same but we invert the value with `1.0 - ...`:

```glsl
float strength = 1.0 - vUv.y;
```

## Pattern 6

![base-06](./files/base-06.png)

To squeeze the gradient like this, we simply multiply the value. The `strength` will jump quickly to `1`, but we can't show a color brighter than white so the rest of the gradient stays white:

```glsl
float strength = vUv.y * 10.0;
```

## Pattern 7

![base-07](./files/base-07.png)

Now we are talking. To repeat the gradient, we use a modulo. The modulo operation finds the remainder after a division of the first number by the second one.

- `0.5` modulo `1.0` will be `0.5`
- `0.8` modulo `1.0` will be `0.8`
- `1.2` module `1.0` will be `0.2`
- `1.7` modulo `1.0` will be `0.7`
- `2.0` modulo `1.0` will be `0.0`
- `2.4` modulo `1.0` will be `0.4`

It's like having the first number going back to `0` once it reaches the second number.

In many languages, we can use the `%` to apply the modulo but in GLSL we have to use the `mod(...)` function:

```glsl
float strength = mod(vUv.y * 10.0, 1.0);
```

## Pattern 8

![base-08](./files/base-08.png)

This pattern seems based on the previous one but instead of a gradient, we have `0.0` or `1.0`.

We could have done this with an `if` statement —because conditions do work in GLSL— but I recommend avoiding conditions for performance reasons.

We can use the `step(...)` function. We provide an edge value as the first parameter and a number as the second parameter. If the number value is lower than the edge, we get `0.0`. If it's higher than the edge, we get `1.0`:

```glsl
float strength = mod(vUv.y * 10.0, 1.0);
strength = step(0.5, strength);
```

As you can see, we used the `step(...)` function in another line while re-assigning `strength`. That has no performance drawback. You'll see many shader developers write huge code lines with as few variables as possible and almost no comment, but this is just because they know what they are doing.

Do as you want, especially if you are a beginner.

## Pattern 9

![base-09](./files/base-09.png)

This pattern is the same as the previous one, but with a higher edge value for the `step(...)`:

```glsl
float strength = mod(vUv.y * 10.0, 1.0);
strength = step(0.8, strength);
```

## Pattern 10

![base-10](./files/base-10.png)

This pattern is the same as the previous one but we used the `x` axis of `vUv` instead of the `y` axis:

```glsl
float strength = mod(vUv.x * 10.0, 1.0);
strength = step(0.8, strength);
```

## Pattern 11

![base-11](./files/base-11.png)

We can also combine them. Here, we have to add the result of the `x` axis to the result on the `y` axis:

```glsl
float strength = step(0.8, mod(vUv.x * 10.0, 1.0));
strength += step(0.8, mod(vUv.y * 10.0, 1.0));
```

## Pattern 12

![base-12](./files/base-12.png)

This pattern uses the same principle but with multiplication. We can only see their intersections:

```glsl
float strength = step(0.8, mod(vUv.x * 10.0, 1.0));
strength *= step(0.8, mod(vUv.y * 10.0, 1.0));
```

## Pattern 13

![base-13](./files/base-13.png)

This pattern is the same as before, but we tweaked the step edge on the `x` axis:

```glsl
float strength = step(0.4, mod(vUv.x * 10.0, 1.0));
strength *= step(0.8, mod(vUv.y * 10.0, 1.0));
```

## Pattern 14

![base-14](./files/base-14.png)

This pattern is a combination of the previous patterns. We create the bars on the `x` axis and add the bars of the `y` axis:

```glsl
float strength = step(0.4, mod(vUv.x * 10.0, 1.0)) * step(0.8, mod(vUv.y * 10.0, 1.0));
strength += step(0.8, mod(vUv.x * 10.0, 1.0)) * step(0.4, mod(vUv.y * 10.0, 1.0));
```

Like in any languages, when the code gets unbearable like this, it's a good idea to refactor a little:

```glsl
float barX = step(0.4, mod(vUv.x * 10.0, 1.0)) * step(0.8, mod(vUv.y * 10.0, 1.0));
float barY = step(0.8, mod(vUv.x * 10.0, 1.0)) * step(0.4, mod(vUv.y * 10.0, 1.0));
float strength = barX + barY;
```

## Pattern 15

![base-15](./files/base-15.png)

This pattern is the same as before, but we apply a small offset on the `x` and `y` axes of the bars:

```glsl
float barX = step(0.4, mod(vUv.x * 10.0 - 0.2, 1.0)) * step(0.8, mod(vUv.y * 10.0, 1.0));
float barY = step(0.8, mod(vUv.x * 10.0, 1.0)) * step(0.4, mod(vUv.y * 10.0 - 0.2, 1.0));
float strength = barX + barY;
```

That is the kind of situation where beginners like us will stick to tweaking the values until it works. There is no problem with that, and the solution will probably make sense once you find it.

## Pattern 16

![base-16](./files/base-16.png)

Let's go in another direction with this one. To get this result, we first need to offset the `vUv.x` so it goes from `-0.5` to `0.5`. Then we need the value to be always positive so it goes from `0.5` to `0.0` to `0.5` again. For this, we can use the `abs(...)` function:

```glsl
float strength = abs(vUv.x - 0.5);
```

## Pattern 17

![base-17](./files/base-17.png)

This pattern looks like a combination of the previous one combines with a variation on the `y` axis. It's no ordinary combination. What you can see here is the minimum value between the pattern on the `x` axis and the pattern on the `y` axis. To do that, we use the `min(...)` function:

```glsl
float strength = min(abs(vUv.x - 0.5), abs(vUv.y - 0.5));
```

## Pattern 18

![base-18](./files/base-18.png)

Same thing as above, but with the `max(...)` function:

```glsl
float strength = max(abs(vUv.x - 0.5), abs(vUv.y - 0.5));
```

## Pattern 19

![base-19](./files/base-19.png)

For this pattern, we simply applied a `step(...)` on the previous value:

```glsl
float strength = step(0.2, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
```

## Pattern 20

![base-20](./files/base-20.png)

This pattern is the multiplication of one square with another but smaller and inverted.

```glsl
float strength = step(0.2, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
strength *= 1.0 - step(0.25, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
```

## Pattern 21

![base-21](./files/base-21.png)

For this pattern, we multiply `vUv.x` by `10.0`, round it to its lower integer with the `floor(...)` function, and divide it by `10.0` to get a value between `0.0`, and `1.0`:

```glsl
float strength = floor(vUv.x * 10.0) / 10.0;
```

## Pattern 22

![base-22](./files/base-22.png)

As before, we can combine the different axes by multiplying them:

```glsl
float strength = floor(vUv.x * 10.0) / 10.0 * floor(vUv.y * 10.0) / 10.0;
```

## Pattern 23

![base-23](./files/base-23.png)

Getting this pattern is complicated because there is no native random function in GLSL. The trick is to get a value so unpredictable that it looks random.

One popular way to get that kind of value is using the following function:

```glsl
float random(vec2 st)
{
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}
```

We provide a `vec2` to this function, and we get a pseudo random value.

If you want to learn more about this function, here's a link from **The Book of Shaders**: [https://thebookofshaders.com/10/](https://thebookofshaders.com/10/)

We can add this function outside of the `main` function, and use it with the `vUv`:

```glsl
varying vec2 vUv;

float random(vec2 st)
{
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

void main()
{
    // ...

    float strength = random(vUv);

    // ...
}
```

Be careful with this random function. Using the wrong values can result in noticeable shapes in the randomness.

## Pattern 24

![base-24](./files/base-24.png)

This pattern is a combination of the two previous ones. First, we create a new `vec2` coordinates named `gridUv` with rounded values:

```glsl
vec2 gridUv = vec2(floor(vUv.x * 10.0) / 10.0, floor(vUv.y * 10.0) / 10.0);
```

Then, we use these coordinates with the `random` function:

```glsl
float strength = random(gridUv);
```

## Pattern 25

![base-25](./files/base-25.png)

This pattern stems from the previous one. To get this tilt effect, we must add the `vUv.x` to the `vUv.y` when creating the `gridUv`:

```glsl
vec2 gridUv = vec2(floor(vUv.x * 10.0) / 10.0, floor((vUv.y + vUv.x * 0.5) * 10.0) / 10.0);
float strength = random(gridUv);
```

## Pattern 26

![base-26](./files/base-26.png)

On this pattern, the further from the bottom left corner, the brighter the strength is.

That is in fact the length of the `vUv`. `vUv` value is equal to `0.0, 0.0` so the length is `0.0` on the bottom-left corner and the further we go away from that corner, the higher its length is.

We can get the length of a vector (`vec2`, `vec3` or `vec4`) with the `length(...)` function:

```glsl
float strength = length(vUv);
```

## Pattern 27

![base-27](./files/base-27.png)

Instead, we will get the distance between `vUv` and the center of our plane. Because our plane UV goes from `0.0, 0.0` to `1.0, 1.0`, the center is `0.5, 0.5`. We are going to create a `vec2` corresponding to the center and get the distance from the `vUv` with the `distance(...)` function:

```glsl
float strength = distance(vUv, vec2(0.5));
```

When creating a vector with only one value, this value will be passed on every properties —`x` and `y` in our case.

Be aware that we could also have offset the `vUv` and use the `length(...)` function.

## Pattern 28

![base-28](./files/base-28.png)

For this pattern, we subtract the previous value to `1.0`:

```glsl
float strength = 1.0 - distance(vUv, vec2(0.5));
```

## Pattern 29

![base-29](./files/base-29.png)

This pattern is handy when creating a light lens effect. To get this result, we start from a small value and divide it by the previously calculated distance:

```glsl
float strength = 0.015 / (distance(vUv, vec2(0.5)));
```

## Pattern 30

![base-30](./files/base-30.png)

This is the same pattern but with the UV squeezed and moved on the `y` axis only:

```glsl
float strength = 0.15 / (distance(vec2(vUv.x, (vUv.y - 0.5) * 5.0 + 0.5), vec2(0.5)));
```

## Pattern 31

![base-31](./files/base-31.png)

And this is the same pattern multiplied with the same formula, but this second one is based on the `x` axis:

```glsl
float strength = 0.15 / (distance(vec2(vUv.x, (vUv.y - 0.5) * 5.0 + 0.5), vec2(0.5)));
strength *= 0.15 / (distance(vec2(vUv.y, (vUv.x - 0.5) * 5.0 + 0.5), vec2(0.5)));
```

## Pattern 32

![base-32](./files/base-32.png)

Getting this pattern is rather laborious. We need to rotate the `vUv` coordinates in the center. Doing a 2D rotation is a mix of `cos(...)` and `sin(...)` that we won't cover here. It's also a good opportunity to use functions. Add this following function before the `main` function:

```glsl
vec2 rotate(vec2 uv, float rotation, vec2 mid)
{
    return vec2(
      cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
      cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
    );
}
```

Then, we can use it to create a new set of UV that we will call `rotatedUV`. The problem is that we want to rotate exactly one-eighth of a full circle. Regrettably, we don't have access to π (pi) in GLSL.

Instead, we can create a variable that contains an approximation to π:

```glsl
float pi = 3.1415926535897932384626433832795;
```

Because this variable will never change, we can save it as a `define` at the start of the code:

```glsl
#define PI 3.1415926535897932384626433832795
```

Defines are cheaper than variables but cannot be changed. It is good practice to right defines in UPPERCASE to distinguish them from other variables.

Then we can use that `PI` value for the second parameter of the `rotate(...)` function (the angle):

```glsl
vec2 rotatedUv = rotate(vUv, PI * 0.25, vec2(0.5));
```

And finally, we replace our `vUv` by this new `rotatedUV`:

```glsl
float strength = 0.15 / (distance(vec2(rotatedUv.x, (rotatedUv.y - 0.5) * 5.0 + 0.5), vec2(0.5)));
strength *= 0.15 / (distance(vec2(rotatedUv.y, (rotatedUv.x - 0.5) * 5.0 + 0.5), vec2(0.5)));
```

## Pattern 33

![base-33](./files/base-33.png)

To draw that disc, we use the `distance(...)` function with the `step(...)` function and apply an offset to control the disc radius:

```glsl
float strength = step(0.5, distance(vUv, vec2(0.5)) + 0.25);
```

We could also have change the first parameter of `step(...)` —named edge— to control the radius.

## Pattern 34

![base-34](./files/base-34.png)

This pattern is very close to the previous one, but we use the `abs(...)` function to keep a positive value:

```glsl
float strength = abs(distance(vUv, vec2(0.5)) - 0.25);
```

## Pattern 35

![base-35](./files/base-35.png)

We can combine the two previous ones to get a circle:

```glsl
float strength = step(0.02, abs(distance(vUv, vec2(0.5)) - 0.25));
```

## Pattern 36

![base-36](./files/base-36.png)

And we can invert it with `1.0 - ...`:

```glsl
float strength = 1.0 - step(0.01, abs(distance(vUv, vec2(0.5)) - 0.25));
```

## Pattern 37

![base-37](./files/base-37.png)

This pattern is based on the previous one, but with a wave-like distortion. To get this result, we create a new UV variable that we can call `wavedUv`, and we add a `sin(...)` based on the `x` axis to the `y` value:

```glsl
vec2 wavedUv = vec2(
    vUv.x,
    vUv.y + sin(vUv.x * 30.0) * 0.1
);
```

Then, we use that `wavedUv` instead of the `vUv`:

```glsl
float strength = 1.0 - step(0.01, abs(distance(wavedUv, vec2(0.5)) - 0.25));
```

## Pattern 38

![base-38](./files/base-38.png)

For this pattern, we also apply the wave distortion to the `x` axis:

```glsl
vec2 wavedUv = vec2(
    vUv.x + sin(vUv.y * 30.0) * 0.1,
    vUv.y + sin(vUv.x * 30.0) * 0.1
);
float strength = 1.0 - step(0.01, abs(distance(wavedUv, vec2(0.5)) - 0.25));
```

## Pattern 39

![base-39](./files/base-39.png)

And we just have to increase the `sin(...)` frequency to end up with a psychedelic effect:

```glsl
vec2 wavedUv = vec2(
    vUv.x + sin(vUv.y * 100.0) * 0.1,
    vUv.y + sin(vUv.x * 100.0) * 0.1
);
float strength = 1.0 - step(0.01, abs(distance(wavedUv, vec2(0.5)) - 0.25));
```

Imagine animating that.

## Pattern 40

![base-40](./files/base-40.png)

This pattern is actually the angle of `vUv`. To get an angle from 2D coordinates, we can use `atan(...)`:

```glsl
float angle = atan(vUv.x, vUv.y);
float strength = angle;
```

## Pattern 41

![base-41](./files/base-41.png)

This pattern is the same but with a `0.5` offset on the `vUv`, to create an angle around the center:

```glsl
float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
float strength = angle;
```

## Pattern 42

![base-42](./files/base-42.png)

One more time, this pattern is the same, but with the angle going from `0.0` to `1.0`. Currently, `atan(...)` returns a value between `-π` and `+π`. First, we can divide by `PI * 2`:

```glsl
float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
angle /= PI * 2.0;
float strength = angle;
```

We get a value that goes from `-0.5` to `0.5`. We just have to add `0.5`:

```glsl
float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
angle /= PI * 2.0;
angle += 0.5;
float strength = angle;
```

Having a proper angle is a positive way to play with circular shapes. We will regroup the `angle` operations into one line to read it more easily:

```glsl
float angle = atan(vUv.x - 0.5, vUv.y - 0.5) / (PI * 2.0) + 0.5;
```

## Pattern 43

![base-43](./files/base-43.png)

This pattern is based on the same technique we used at the beginning with modulo, but this time, with `angle`:

```glsl
float angle = atan(vUv.x - 0.5, vUv.y - 0.5) / (PI * 2.0) + 0.5;
float strength = mod(angle * 20.0, 1.0);
```

## Pattern 44

![base-44](./files/base-44.png)

And this one is using `sin(...)`:

```glsl
float angle = atan(vUv.x - 0.5, vUv.y - 0.5) / (PI * 2.0) + 0.5;
float strength = sin(angle * 100.0);
```

## Pattern 45

![base-45](./files/base-45.png)

We can use the previous value to define the circle we drew earlier's radius:

```glsl
float angle = atan(vUv.x - 0.5, vUv.y - 0.5) / (PI * 2.0) + 0.5;
float radius = 0.25 + sin(angle * 100.0) * 0.02;
float strength = 1.0 - step(0.01, abs(distance(vUv, vec2(0.5)) - radius));
```

## Pattern 46

![base-46](./files/base-46.png)

This pattern is called perlin noise. You probably already have heard of it, and, if not, you probably saw it without knowing it. The perlin noise is instrumental in recreating nature shapes like clouds, water, fire, terrain elevation but it can also be used to animate the grass or snow moving in the wind.

There are many perlin noise algorithms with different results, different dimensions (2D, 3D, and even 4D), some that repeat themselves, others more performant, etc.

Here is a Github gist that lists some of the most popular perlin noises we can find for GLSL: [https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83](https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83)

Be careful though; some codes might not work immediately as we will see. We will now test the first **Classic Perlin Noise** by **Stefan Gustavson**, which is a 2D noise —we provide a `vec2` and we get a `float` in return. Only copy the code to your shader, but don't use it yet:

```glsl
//  Classic Perlin 2D Noise
//  by Stefan Gustavson
//
vec2 fade(vec2 t)
{
    return t*t*t*(t*(t*6.0-15.0)+10.0);
}

float cnoise(vec2 P)
{
    vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
    vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
    Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
    vec4 ix = Pi.xzxz;
    vec4 iy = Pi.yyww;
    vec4 fx = Pf.xzxz;
    vec4 fy = Pf.yyww;
    vec4 i = permute(permute(ix) + iy);
    vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
    vec4 gy = abs(gx) - 0.5;
    vec4 tx = floor(gx + 0.5);
    gx = gx - tx;
    vec2 g00 = vec2(gx.x,gy.x);
    vec2 g10 = vec2(gx.y,gy.y);
    vec2 g01 = vec2(gx.z,gy.z);
    vec2 g11 = vec2(gx.w,gy.w);
    vec4 norm = 1.79284291400159 - 0.85373472095314 * vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
    g00 *= norm.x;
    g01 *= norm.y;
    g10 *= norm.z;
    g11 *= norm.w;
    float n00 = dot(g00, vec2(fx.x, fy.x));
    float n10 = dot(g10, vec2(fx.y, fy.y));
    float n01 = dot(g01, vec2(fx.z, fy.z));
    float n11 = dot(g11, vec2(fx.w, fy.w));
    vec2 fade_xy = fade(Pf.xy);
    vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
    float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
    return 2.3 * n_xy;
}
```

Unluckily, this code seems to break our shader, and it's because a function named `permute` is missing. Here it is and you can add it right before the `fade` function:

```glsl
vec4 permute(vec4 x)
{
    return mod(((x*34.0)+1.0)*x, 289.0);
}
```

We now have access to a `cnoise` function, and we can use the `vUv` on it:

```glsl
float strength = cnoise(vUv);
```

It's a rough result, but still, we have something. To see more of the pattern like in the preview, multiply the `vUv` by `10.0`:

```glsl
float strength = cnoise(vUv * 10.0);
```

## Pattern 47

![base-47](./files/base-47.png)

This pattern uses the same noise, but with a step on it:

```glsl
float strength = step(0.0, cnoise(vUv * 10.0));
```

Very useful if at some point, you feel like creating a cow.

## Pattern 48

![base-48](./files/base-48.png)

For this pattern, we used an `abs(...)` on the value, and subtract the result to `1.0`:

```glsl
float strength = 1.0 - abs(cnoise(vUv * 10.0));
```

You can work with it to create lightnings, reflection under water or plasma energy things.

## Pattern 49

![base-49](./files/base-49.png)

For this pattern, we applied a `sin(...)` on the noise:

```glsl
float strength = sin(cnoise(vUv * 10.0) * 20.0);
```

## Pattern 50

![base-50](./files/base-50.png)

And for this final one, we combined the `sin(...)` and the `step(...)`:

```glsl
float strength = step(0.9, sin(cnoise(vUv * 10.0) * 20.0));
```

Easy peasy, black and white lemon squeezy.

## Test it with colors

It was fun, but these black and white colors are getting dull. One cool color we had at the start was when we used the `vUv` directly in the `gl_FragColor`:

```glsl
gl_FragColor = vec4(vUv, 1.0, 1.0);
```

What we can do now is use that gradient color instead of the white.

### Mix colors

To do this, we are going to use the `mix(...)` function. This function needs 3 arguments:

- A first input that can be a `float`, a `vec2`, a `vec3`, or a `vec4`.
- A second input, which should be of the same type.
- A third value that has to be a `float`. It will decide to take more of the first input or more of the second one. If we use `0.0`, the returned value will be the first input. If we use `1.0`, the return value will be the second one. If we use `0.5`, the value will be a mix between the two inputs. You can also go below `0.0` or above `1.0` and the values will be extrapolated.

Let's create a first color:

```glsl
vec3 blackColor = vec3(0.0);
```

Let's form a second color:

```glsl
vec3 uvColor = vec3(vUv, 1.0);
```

We obtain the mix between the two colors according to the `strength`:

```glsl
vec3 mixedColor = mix(blackColor, uvColor, strength);
```

And we use that mix in the `gl_FragColor` without changing the alpha:

```glsl
gl_FragColor = vec4(mixedColor, 1.0);
```

Have fun testing this with all the previous patterns.

![uvColored-03](./files/uvColored-03.png)

![uvColored-05](./files/uvColored-05.png)

![uvColored-08](./files/uvColored-08.png)

![uvColored-10](./files/uvColored-10.png)

### Fix the strength

If you test patterns such as #11, #14, and #15 with this UV gradient, you'll see some strange behaviors at the intersections.

![bug-11](./files/bug-11.png)

![bug-14](./files/bug-14.png)

![bug-15](./files/bug-15.png)

It looks like the intersections are too bright, and that's what they are exactly. It's because the `strength` value that we use in the `mix(...)` is higher than `1.0` and the output gets extrapolated —meaning it goes beyond the second value.

To limit this value, we can use the `clamp(...)` function on the `strength`. This function will simply set a low and a high limits to a value:

```glsl
// Pattern 11
float strength = step(0.8, mod(vUv.x * 10.0, 1.0));
strength += step(0.8, mod(vUv.y * 10.0, 1.0));
strength = clamp(strength, 0.0, 1.0);

// ...

// Pattern 14
float barX = step(0.4, mod(vUv.x * 10.0, 1.0)) * step(0.8, mod(vUv.y * 10.0, 1.0));
float barY = step(0.8, mod(vUv.x * 10.0, 1.0)) * step(0.4, mod(vUv.y * 10.0, 1.0));
float strength = barX + barY;
strength = clamp(strength, 0.0, 1.0);

// Pattern 15
float barX = step(0.4, mod(vUv.x * 10.0 - 0.2, 1.0)) * step(0.8, mod(vUv.y * 10.0, 1.0));
float barY = step(0.8, mod(vUv.x * 10.0, 1.0)) * step(0.4, mod(vUv.y * 10.0 - 0.2, 1.0));
float strength = barX + barY;
strength = clamp(strength, 0.0, 1.0);
```

![fix-11](./files/fix-11.png)

![fix-14](./files/fix-14.png)

![fix-15](./files/fix-15.png)

## Go further

There are many other potential patterns and many additional functions. The idea of this lesson was to give you strings to your bow for your future projects and to practice GLSL in a trivial context.

One useful thing we didn't try would be to put those shapes into functions. We could have created a `getCircle` function, a `getSquare` function, etc. with correct parameters to reuse them easily.

Keep practicing, don't be afraid to create new shapes, experiment, and look for help if you need it.

Also, try to add some uniforms to animate the values or add some tweaks to the debug panel.
