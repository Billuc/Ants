import * as THREE from "three";

export const LuminosityHighLowPassShader = {
    shaderID: 'luminosityHighLowPass',

	uniforms: {
		'tDiffuse': { value: null },
		'luminosityLowThreshold': { value: 1.0 },
		'luminosityHighThreshold': { value: 1.0 },
		'smoothWidth': { value: 1.0 },
		'defaultColor': { value: new THREE.Color( 0x000000 ) },
		'defaultOpacity': { value: 0.0 }
	},

	vertexShader: /* glsl */`
		varying vec2 vUv;
		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}
    `,

	fragmentShader: /* glsl */`
		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityLowThreshold;
		uniform float luminosityHighThreshold;
		uniform float smoothWidth;
		varying vec2 vUv;

		void main() {
			vec4 texel = texture2D( tDiffuse, vUv );
			vec3 luma = vec3( 0.299, 0.587, 0.114 );
			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float v = dot( texel.xyz, luma );
			float highPassAlpha = smoothstep( luminosityLowThreshold, luminosityLowThreshold + smoothWidth, v );
			float lowPassAlpha = 1.0 - smoothstep( luminosityHighThreshold, luminosityHighThreshold + smoothWidth, v );
            float alpha = min( highPassAlpha, lowPassAlpha );

			gl_FragColor = mix( outputColor, texel, alpha );
		}
    `
};