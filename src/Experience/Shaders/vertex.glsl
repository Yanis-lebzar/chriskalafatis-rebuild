varying vec2 vUv;
varying vec2 vH;

uniform float uTime;
uniform float visibleHeight;

void main()
{
	vUv = uv;
    	vH = uv;

    vH.y = mix(uv.y * visibleHeight, uv.y + (1.0 - visibleHeight), ( uv.y - 0.4 ) * 3.2);

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    // modelPosition.z = sin(modelPosition.x * uTime) * 0.1;
    vec4 viewPosition = viewMatrix * modelPosition;
    // viewPosition.x = sin(viewPosition.x + uTime);
    vec4 projectedPosition = projectionMatrix * viewPosition;
    // projectedPosition.z = sin(projectedPosition.x + uTime);
    gl_Position = projectedPosition;
}