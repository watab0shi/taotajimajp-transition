
varying vec2      vUv;
varying vec2      vUv1;

uniform float     uTime;
uniform float     uProgress;
uniform vec2      uAccel;
uniform sampler2D uTex0;
uniform sampler2D uTex1;

vec2 translateDirection = vec2( -.5, 1. );

vec2 mirrored( vec2 v ) {
  vec2 m = mod( v, 2. );
  return mix( m, 2. - m, step( 1., m ) );
}

float tri( float p ) {
  return mix( p, 1. - p, step( .5, p ) ) * 2.;
}

void main() {
  vec2 uv = vUv;

  float pct = fract( uProgress );

  float delayValue = ( ( pct * 7. ) - ( uv.y * 2. ) + uv.x ) - 2.;
  delayValue = clamp( delayValue, 0., 1. );

  vec2 translate = pct + delayValue * uAccel;
  vec2 translate0 = translateDirection * translate;
  vec2 translate1 = translateDirection * ( translate - 1. - uAccel );

  vec2 w = sin( sin( uTime ) * vec2( 0., 0.3 ) + uv.yx * vec2( 0., 4. ) ) * vec2( 0., .5 );
  vec2 xy = w * ( tri( pct ) * .5 + tri( delayValue ) * .5 );

  vec2 uv0 = vUv1 + translate0 + xy;
  vec2 uv1 = vUv1 + translate1 + xy;

  vec3 color0 = texture2D( uTex0, mirrored( uv0 ) ).rgb;
  vec3 color1 = texture2D( uTex1, mirrored( uv1 ) ).rgb;

  vec3 color = mix( color0, color1, delayValue );

  // 確認用
  // color = color0;
  // color = color1;
  // color = vec3( delayValue );
  // color = vec3( translate0, 0. );
  // color = vec3( translate1, 0. );
  // color = vec3( w, 0. );
  // color = vec3( xy, 0. );
  // color = vec3( uv0, 0. );
  // color = vec3( uv1, 0. );

  gl_FragColor = vec4( color, 1. );
}
