varying vec2 vUv;
varying vec2 vH;

uniform float uTime;
uniform float visibleHeight;
uniform float uProgress;

void main()
{
	vUv = uv;
    	vH = uv;

    vH.y = mix(uv.y * visibleHeight, uv.y + (1.0 - visibleHeight), ( uv.y - 0.4 ) * 3.2);

    vec3 newposition = position;

    newposition.y *= sin(newposition.x/4500. * ((-3.14159265359/2.) * 10.) + uTime * 1.);
vec3 new = mix(position, newposition, uProgress);
    vec4 modelPosition = modelMatrix * vec4(new, 1.0);

    // modelPosition.z = sin(modelPosition.x * uTime) * 0.1;
    vec4 viewPosition = viewMatrix * modelPosition;
    // viewPosition.x = sin(viewPosition.x + uTime);
    vec4 projectedPosition = projectionMatrix * viewPosition;
    // projectedPosition.z = sin(projectedPosition.x + uTime);
    gl_Position = projectedPosition;
}