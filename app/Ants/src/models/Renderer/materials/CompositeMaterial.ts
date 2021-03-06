import { ShaderMaterial } from "three";

export class CompositeMaterial extends ShaderMaterial {
    constructor(nMips: number) {
        super();

        this.defines = { 'NUM_MIPS': nMips };
        
        this.uniforms = { 
            'blurTexture1': { value: null },
            'blurTexture2': { value: null },
            'blurTexture3': { value: null },
            'blurTexture4': { value: null },
            'blurTexture5': { value: null },
            'dirtTexture': { value: null },
            'bloomStrength': { value: 1.0 },
            'bloomFactors': { value: null },
            'bloomTintColors': { value: null },
            'bloomRadius': { value: 0.0 }
        };

        this.vertexShader = /* glsl */`
            varying vec2 vUv;

            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
            }
        `,

        this.fragmentShader = /* glsl */`
            varying vec2 vUv;

            uniform sampler2D blurTexture1;
            uniform sampler2D blurTexture2;
            uniform sampler2D blurTexture3;
            uniform sampler2D blurTexture4;
            uniform sampler2D blurTexture5;
            uniform sampler2D dirtTexture;

            uniform float bloomStrength;
            uniform float bloomRadius;
            uniform float bloomFactors[NUM_MIPS];
            uniform vec3 bloomTintColors[NUM_MIPS];

            float lerpBloomFactor(const in float factor) {
                float mirrorFactor = 1.2 - factor;
                return mix(factor, mirrorFactor, bloomRadius);
            }

            void main() {
                gl_FragColor = bloomStrength * (lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * texture2D(blurTexture1, vUv) +
                    lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * texture2D(blurTexture2, vUv) +
                    lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * texture2D(blurTexture3, vUv) +
                    lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * texture2D(blurTexture4, vUv) +
                    lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * texture2D(blurTexture5, vUv));
            }
        `;
    }
}