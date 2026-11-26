varying float vHeight;
varying float vEdgeFade;
varying float vPulse;

void main() {
  float distanceFromCenter = length(gl_PointCoord - vec2(0.5));
  float particleCore = 1.0 - smoothstep(0.12, 0.5, distanceFromCenter);
  float brightness = clamp(0.48 + vHeight * 2.8 + vPulse * 0.18, 0.0, 1.0);
  vec3 deepGold = vec3(0.68, 0.27, 0.055);
  vec3 warmGold = vec3(1.0, 0.66, 0.29);
  vec3 color = mix(deepGold, warmGold, brightness);
  float alpha = particleCore * vEdgeFade * (0.42 + brightness * 0.28);

  gl_FragColor = vec4(color, alpha);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
