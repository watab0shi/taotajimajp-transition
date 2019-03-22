
varying vec2 vUv;
varying vec2 vUv1;

uniform float uFixAspect;

void main() {
  vUv = uv;

  // アスペクト補正（cover）
  vUv1 = uv - 0.5;
  vUv1.y *= uFixAspect;
  vUv1 += 0.5;

  gl_Position = vec4( position, 1.0 );
}
