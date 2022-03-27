export const vertexShader = `
varying vec2 vUV;

void main() {
    vUV = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const fragmentShader = `
uniform sampler2D baseTexture;
uniform sampler2D bloomTexture;

varying vec2 vUV;

void main() {
    gl_FragColor = ( texture2D( baseTexture, vUV ) + vec4( 1.0 ) * texture2D( bloomTexture, vUV ) );
}
`;
