import * as THREE from "three";

export const ContrastShader = {
    shaderID: 'contrastShader',

	uniforms: {
		'tDiffuse': { value: null },
		'defaultColor': { value: new THREE.Color( 0x000000 ) },
		'defaultOpacity': { value: 0.0 },
		'texSize': { value: null }
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
		
		varying vec2 vUv;

		void main() {
			ivec2 texSize = textureSize(tDiffuse, 0);

			vec4 texel = texture2D( tDiffuse, vUv );
			vec4 texelUp = texture2D( tDiffuse, vUv + vec2(0.0, -1.0 / float(texSize.y)) );
			vec4 texelLeft = texture2D( tDiffuse, vUv + vec2(-1.0 / float(texSize.x), 0.0) );
			vec4 texelBottom = texture2D( tDiffuse, vUv + vec2(0.0, 1.0 / float(texSize.y)) );
			vec4 texelRight = texture2D( tDiffuse, vUv + vec2(1.0 / float(texSize.x), 0.0) );

			vec3 luma = vec3( 0.299, 0.587, 0.114 );
			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float v = dot( texel.xyz, luma );
			float vUp = dot( texelUp.xyz, luma );
			float vLeft = dot( texelLeft.xyz, luma );
			float vBottom = dot( texelBottom.xyz, luma );
			float vRight = dot( texelRight.xyz, luma );

			float alpha = clamp(4.0 * v - vUp - vBottom - vLeft - vRight, 0.0, 1.0);

			gl_FragColor = mix( outputColor, texel, alpha );
		}
    `
};