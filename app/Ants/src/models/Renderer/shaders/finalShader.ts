import * as THREE from "three";

export const FinalShader = {
    shaderID: 'luminosityHighLowPass',

	uniforms: {
        baseTexture: { value: null },
        bloomTexture: { value: null },
        worldTexture: { value: null },
	},

    vertexShader: /* glsl */`
        varying vec2 vUV;
        
        void main() {
            vUV = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,

    fragmentShader: /* glsl */`
        uniform sampler2D baseTexture;
        uniform sampler2D bloomTexture;
        uniform sampler2D worldTexture;
        
        varying vec2 vUV;
        
        void main() {
            gl_FragColor = ( texture2D( baseTexture, vUV ) + vec4( 1.0 ) * texture2D( bloomTexture, vUV ) + vec4( 1.0 ) * texture2D( worldTexture, vUV ) );
        }
    `
};