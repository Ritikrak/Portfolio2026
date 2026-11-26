uniform float uTime;
uniform vec2 uMouse;
uniform float uMouseStrength;
uniform float uPixelRatio;
uniform float uPointSize;

varying float vHeight;
varying float vEdgeFade;
varying float vPulse;

float hash(vec2 point) {
  return fract(sin(dot(point, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 point) {
  vec2 cell = floor(point);
  vec2 local = fract(point);
  vec2 smoothLocal = local * local * (3.0 - 2.0 * local);

  float lower = mix(
    hash(cell),
    hash(cell + vec2(1.0, 0.0)),
    smoothLocal.x
  );
  float upper = mix(
    hash(cell + vec2(0.0, 1.0)),
    hash(cell + vec2(1.0, 1.0)),
    smoothLocal.x
  );

  return mix(lower, upper, smoothLocal.y);
}

void main() {
  vec3 displaced = position;
  vec2 point = position.xy;
  float time = uTime;

  float broadWave = sin(point.x * 4.1 + time * 0.62) * 0.13;
  float crossWave = sin(point.y * 6.3 - time * 0.48) * 0.085;
  float diagonalWave = sin((point.x + point.y) * 3.4 + time * 0.36) * 0.06;
  float organicNoise = (noise(point * 2.6 + vec2(time * 0.055, -time * 0.04)) - 0.5) * 0.2;

  float mouseDistance = distance(point, uMouse);
  float mouseRipple = sin(mouseDistance * 25.0 - time * 3.2)
    * exp(-mouseDistance * 4.2)
    * 0.15
    * uMouseStrength;

  float height = broadWave + crossWave + diagonalWave + organicNoise + mouseRipple;
  displaced.z += height;

  vec4 viewPosition = modelViewMatrix * vec4(displaced, 1.0);
  gl_Position = projectionMatrix * viewPosition;
  gl_PointSize = clamp(
    uPointSize * uPixelRatio * (2.8 / max(0.2, -viewPosition.z)),
    1.0,
    7.0
  );

  float edgeDistance = min(
    min(uv.x, 1.0 - uv.x),
    min(uv.y, 1.0 - uv.y)
  );
  vHeight = height;
  vEdgeFade = smoothstep(0.0, 0.12, edgeDistance);
  vPulse = 0.5 + 0.5 * sin(time * 0.8 + point.x * 2.1 + point.y * 1.6);
}
