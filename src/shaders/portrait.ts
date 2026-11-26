export const portraitVertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const portraitFragmentShader = `
uniform sampler2D uImage;
uniform vec2 uResolution;
uniform vec2 uImageResolution;
uniform vec2 uMouse;
uniform float uTime;
uniform float uGrain;
uniform float uParticleAmount;
uniform float uZoom;
uniform float uImageCenterY;
uniform float uScroll;

varying vec2 vUv;

float random(vec2 coordinate) {
  return fract(sin(dot(coordinate, vec2(12.9898, 78.233))) * 43758.5453);
}

float halftone(vec2 coordinate, float luminance) {
  vec2 screenPosition = coordinate * uResolution;
  float diagonalPosition = dot(screenPosition, vec2(0.7071, 0.7071));
  float line = abs(sin(diagonalPosition * 1.1));

  return (1.0 - smoothstep(0.08, 0.32, line)) * smoothstep(0.12, 0.82, luminance);
}

float particleHalo(vec2 coordinate, float scrollProgress) {
  vec2 origin = vec2(0.5, 0.44);
  float spread = 1.0 + scrollProgress * 1.25;
  vec2 dispersedCoordinate = origin + (coordinate - origin) / spread;
  const float cellSize = 5.2;
  vec2 cell = floor(dispersedCoordinate * uResolution / cellSize);
  vec2 local = fract(dispersedCoordinate * uResolution / cellSize);
  float seed = random(cell);
  if (seed < 0.58) return 0.0;

  vec2 center = vec2(random(cell + 3.1), random(cell + 8.7));
  float radius = mix(0.85, 1.65, random(cell + 6.5));
  float point = 1.0 - smoothstep(radius * 0.55, radius, length((local - center) * cellSize));
  float ellipseDistance = length((dispersedCoordinate - origin) / vec2(0.36, 0.48));
  float halo = smoothstep(0.82, 0.98, ellipseDistance) *
    (1.0 - smoothstep(1.18, 1.48, ellipseDistance));
  float pulse = 0.82 + 0.18 * sin(uTime * 0.55 + seed * 6.2831);

  return point * halo * pulse;
}

void main() {
  vec2 uv = vUv;
  vec2 pointerDelta = vUv - uMouse;
  float pointerFalloff = exp(-dot(pointerDelta, pointerDelta) * 34.0);
  float ripple = sin(length(pointerDelta) * 42.0 - uTime * 2.2);
  uv += normalize(pointerDelta + vec2(0.0001)) * ripple * pointerFalloff * 0.004;
  uv.x += sin(uv.y * 13.0 + uTime * 0.32) * 0.0012;

  float viewAspect = uResolution.x / max(uResolution.y, 1.0);
  float imageAspect = uImageResolution.x / max(uImageResolution.y, 1.0);

  if (viewAspect < imageAspect) {
    uv.x = (uv.x - 0.5) * (viewAspect / imageAspect) + 0.5;
  } else {
    uv.y = (uv.y - 0.5) * (imageAspect / viewAspect) + 0.5;
  }

  uv = (uv - vec2(0.5)) / uZoom + vec2(0.5, uImageCenterY);

  vec4 sourcePixel = texture2D(uImage, uv);
  vec3 source = sourcePixel.rgb;
  float subjectAlpha = sourcePixel.a;
  vec2 imageTexel = 1.0 / max(uImageResolution, vec2(1.0));
  float silhouetteEdge = max(
    max(
      abs(subjectAlpha - texture2D(uImage, uv + vec2(imageTexel.x, 0.0)).a),
      abs(subjectAlpha - texture2D(uImage, uv - vec2(imageTexel.x, 0.0)).a)
    ),
    max(
      abs(subjectAlpha - texture2D(uImage, uv + vec2(0.0, imageTexel.y)).a),
      abs(subjectAlpha - texture2D(uImage, uv - vec2(0.0, imageTexel.y)).a)
    )
  );
  float luminance = dot(source, vec3(0.2126, 0.7152, 0.0722));
  luminance = clamp((luminance - 0.32) * 1.25 + 0.46, 0.0, 1.0);
  vec3 monochrome = vec3(luminance);

  vec2 grainOrigin = vec2(0.5, 0.44);
  float grainSpread = 1.0 + uScroll * 1.25;
  vec2 dispersedGrainUV = grainOrigin + (vUv - grainOrigin) / grainSpread;
  float screenDots = halftone(dispersedGrainUV, luminance) * subjectAlpha;
  monochrome *= mix(1.0, 0.62, screenDots);

  float silverRim = smoothstep(0.06, 0.28, silhouetteEdge) *
    smoothstep(0.4, 0.92, vUv.x) * subjectAlpha;
  monochrome += vec3(0.16) * silverRim;

  float particles = particleHalo(vUv, uScroll) * uParticleAmount *
    (1.0 - uScroll * 0.22);
  vec3 particleColor = vec3(0.62);
  float imageFade = 1.0 - smoothstep(0.0, 1.15, uScroll);
  monochrome = mix(
    particleColor,
    mix(monochrome, particleColor, particles),
    imageFade
  );

  float grain = random(gl_FragCoord.xy + vec2(uTime * 37.0, uTime * 13.0)) - 0.5;
  monochrome += grain * uGrain;

  float vignette = 1.0 - smoothstep(0.28, 0.78, length((vUv - 0.5) * vec2(0.88, 1.0)));
  monochrome *= mix(0.7, 1.0, vignette);

  float imageAlpha = subjectAlpha * imageFade * 0.94;
  gl_FragColor = vec4(clamp(monochrome, 0.0, 1.0), max(imageAlpha, particles));
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;
