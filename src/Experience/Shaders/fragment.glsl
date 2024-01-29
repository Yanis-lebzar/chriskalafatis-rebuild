uniform vec2 uGeometrySize;
uniform vec2 uImageSize;
uniform sampler2D uTexture;
uniform float uTime;
uniform float uBorderRadius;
varying vec2 vUv;

// Background cover UV
 
 vec2 getUvs(vec2 planeRes, vec2 mediaRes, vec2 uv) {
    vec2 ratio = vec2(
        min((planeRes.x / planeRes.y) / (mediaRes.x / mediaRes.y), 1.0),
        min((planeRes.y / planeRes.x) / (mediaRes.y / mediaRes.x), 1.0)
    );
    vec2 finalUv = vec2(
        uv.x * ratio.x + (1.0 - ratio.x) * 0.5,
        uv.y * ratio.y + (1.0 - ratio.y) * 0.5
    );
    return finalUv;
}

// Plot a line on Y using a value between 0.0-1.0
float plot(vec2 st) {    
    return smoothstep(0.02, 0.0, abs(st.y - st.x));
}

float plotPct(vec2 st, float pct){
  return  smoothstep( pct-0.02, pct, st.y) -
          smoothstep( pct, pct+0.02, st.y);
}

// cosine based palette, 4 vec3 params
vec3 palette( float t)
{
    vec3 a = vec3(0.5, 0., 0.);
    vec3 b = vec3(0.5, 0.5, 0.5);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.263, 0.416, 0.557);

    return a + b*cos( 6.28318*(c*t+d) );
}

 // Border radius

 float udRoundBox( vec2 p, vec2 b, float r ){
    return length(max(abs(p)-b+r,0.0))-r;
}

float roundCorners(vec2 planeRes, vec2 uv, float radius) {
    float iRadius = min(planeRes.x, planeRes.y) * radius;
    vec2 halfRes = 0.5 * planeRes.xy;
    float b = udRoundBox( (uv * planeRes) - halfRes, halfRes, iRadius );
    return clamp(1.0 - b, 0.0, 1.0);
}

void main() {
    
vec2 uv = getUvs(uGeometrySize, uImageSize, vUv);
vec4 color = texture2D(uTexture, uv);
//     vec2 uv = (vUv - 0.5 ) * 2.0;
//     vec2 uv0 = uv;
//     vec3 finalColor = vec3(0.0);

//     for (float i = 0.; i < 3.; i++) {
     
//     uv = fract(uv * 1.5) - 0.5;

//     float d = length(uv);

//     vec3 col = palette((length(uv0)) + uTime);

//     d = sin(d * 8. + uTime ) / 8.;
//     d = abs(d);

//     d = .02 / d;
//     finalColor += col * d;
//  }

float roundC = roundCorners(uGeometrySize, vUv, uBorderRadius / min(uGeometrySize.x, uGeometrySize.y));


    // color.a *= roundC;

     gl_FragColor = color;
     gl_FragColor.a = 1.0;

gl_FragColor.a *= roundC;


    // gl_FragColor = vec4(finalColor, 1.);
}