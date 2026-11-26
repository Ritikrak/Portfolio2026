uniform float uTime;
uniform vec2 uMouse;
uniform float uMouseStrength;
uniform float uPixelRatio;
uniform float uPointSize;

varying float vHeight;
varying float vEdgeFade;
varying float vPulse;
varying float vCenterDistance;
varying float vGravity;

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
  vec2 lensCenter = vec2(-0.12, 0.0);
  vec2 point = position.xy - lensCenter;
  float radius = length(point);
  vec2 radialDirection = point / max(radius, 0.001);
  vec2 tangentDirection = vec2(-radialDirection.y, radialDirection.x);
  float time = uTime;
  float gravity = exp(-radius * 1.1) / max(radius, 0.16);
  float orbitPhase = time * 0.34 - radius * 4.6;
  float lensing = min(gravity * 0.12, 0.42);
  float spiralWave = sin(radius * 30.0 - time * 1.35 + atan(point.y, point.x) * 0.45)
    * exp(-radius * 0.75)
    * 0.065;

  displaced.xy -= radialDirection * min(gravity * 0.055, 0.24);
  displaced.xy += tangentDirection * lensing * (0.32 + sin(orbitPhase) * 0.68);
  displaced.xy += radialDirection * spiralWave;

  float radialWave = sin(radius * 30.0 - time * 1.65)
    * exp(-radius * 1.2)
    * 0.055;
  float surfaceNoise = (noise(point * 3.1 + vec2(time * 0.03, -time * 0.05)) - 0.5) * 0.065;
  float broadWave = sin(point.x * 3.7 + time * 0.45) * 0.035
    + sin(point.y * 4.8 - time * 0.5) * 0.03;

  vec2 pointerPoint = uMouse - lensCenter;
  float mouseDistance = distance(point, pointerPoint);
  float mouseRipple = sin(mouseDistance * 25.0 - time * 3.2)
    * exp(-mouseDistance * 4.2)
    * 0.12
    * uMouseStrength;
  float height = gravity * 0.025 + radialWave + surfaceNoise + broadWave + mouseRipple;
  displaced.z += height;
  displaced.xy += lensCenter;

  vec4 viewPosition = modelViewMatrix * vec4(displaced, 1.0);
  gl_Position = projectionMatrix * viewPosition;
  gl_PointSize = clamp(
    uPointSize
      * uPixelRatio
      * (2.8 / max(0.2, -viewPosition.z))
      * (1.0 + gravity * 0.08),
    1.0,
    7.0
  );

  float edgeDistance = min(
    min(uv.x, 1.0 - uv.x),
    min(uv.y, 1.0 - uv.y)
  );
  vHeight = height;
  vEdgeFade = smoothstep(0.0, 0.12, edgeDistance);
  vPulse = 0.5 + 0.5 * sin(time * 0.85 + point.x * 2.0 + point.y * 1.8);
  vCenterDistance = radius;
  vGravity = gravity;
}
