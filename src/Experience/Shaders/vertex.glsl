varying vec2 vUv;
uniform float uTime;
void main()
{
	vUv = uv;
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    // modelPosition.z = sin(modelPosition.x * uTime) * 0.1;
    vec4 viewPosition = viewMatrix * modelPosition;
    // viewPosition.x = sin(viewPosition.x + uTime);
    vec4 projectedPosition = projectionMatrix * viewPosition;
    // projectedPosition.z = sin(projectedPosition.x + uTime);
    gl_Position = projectedPosition;
}