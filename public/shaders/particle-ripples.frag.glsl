varying float vHeight;
varying float vEdgeFade;
varying float vPulse;
varying float vCenterDistance;
varying float vGravity;

void main() {
  float voidMask = smoothstep(0.265, 0.31, vCenterDistance);
  if (voidMask <= 0.001) discard;

  float distanceFromCenter = length(gl_PointCoord - vec2(0.5));
  float particleCore = 1.0 - smoothstep(0.12, 0.5, distanceFromCenter);
  float eventHorizon = exp(-pow((vCenterDistance - 0.32) * 30.0, 2.0));
  float orbitalBands = pow(
    0.5 + 0.5 * sin((vCenterDistance - 0.3) * 38.0),
    8.0
  ) * exp(-max(vCenterDistance - 0.3, 0.0) * 4.4);
  float radialFade = 1.0 - smoothstep(1.18, 1.64, vCenterDistance);
  float brightness = clamp(
    0.38 + vHeight * 2.4 + vPulse * 0.12 + vGravity * 0.08
      + eventHorizon * 0.46 + orbitalBands * 0.52,
    0.0,
    1.0
  );
  vec3 deepGold = vec3(0.62, 0.19, 0.035);
  vec3 warmGold = vec3(1.0, 0.62, 0.2);
  vec3 color = mix(deepGold, warmGold, brightness);
  color = mix(color, vec3(1.0, 0.72, 0.36), max(eventHorizon * 0.78, orbitalBands * 0.3));

  float alpha = particleCore
    * vEdgeFade
    * voidMask
    * radialFade
    * (0.38 + brightness * 0.36);
  gl_FragColor = vec4(color, alpha);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
