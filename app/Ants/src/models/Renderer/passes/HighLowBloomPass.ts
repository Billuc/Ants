import {
	AdditiveBlending,
	Color,
	IUniform,
	LinearFilter,
	MeshBasicMaterial,
	RGBAFormat,
	ShaderMaterial,
	UniformsUtils,
	Vector2,
	Vector3,
	WebGLRenderer,
	WebGLRenderTarget
} from 'three';
import { FullScreenQuad, Pass } from 'three/examples/jsm/postprocessing/Pass';
import { CopyShader } from "three/examples/jsm/shaders/CopyShader";
import SeparableBlurMaterial from '../materials/SeparableBlurMaterial';
import { CompositeMaterial } from '../materials/CompositeMaterial';
import LuminosityHighLowMaterial from '../materials/LuminosityHighLowMaterial';
import CopyMaterial from '../materials/CopyMaterial';

/**
 * Bloom pass with both high and low thresholds
 * Inspired by UnrealBloomPass : https://github.com/mrdoob/three.js/blob/r138/examples/jsm/postprocessing/UnrealBloomPass.js
 */
export class HighLowBloomPass extends Pass {
	// Consts

	readonly BlurDirectionX = new Vector2( 1.0, 0.0 );
	readonly BlurDirectionY = new Vector2( 0.0, 1.0 );
	
	// User Parameters
	
	strength: number;
	radius: number;
	thresholdLow: number;
	thresholdHigh: number;
	resolution: Vector2;

	// Render Variables

	clearColor: Color;
	renderTargetsHorizontal: WebGLRenderTarget[];
	renderTargetsVertical: WebGLRenderTarget[];
	nMips: number;
	renderTargetBright: WebGLRenderTarget;

	// Shaders Variables

	luminosityHighLowMaterial: ShaderMaterial;
	separableBlurMaterials: ShaderMaterial[];
	compositeMaterial: ShaderMaterial;
	bloomTintColors: Vector3[];
	copyMaterial: ShaderMaterial;

	// Others
	
	private _oldClearColor: Color;
	oldClearAlpha: number;
	basic: MeshBasicMaterial;
	fsQuad: FullScreenQuad;


	constructor(resolution: Vector2, strength: number, radius: number, thresholdLow: number, thresholdHigh: number) {
		super();

		this.strength = ( strength !== undefined ) ? strength : 1;
		this.radius = radius;
		this.thresholdLow = thresholdLow;
		this.thresholdHigh = thresholdHigh;
		this.resolution = ( resolution !== undefined ) ? new Vector2( resolution.x, resolution.y ) : new Vector2( 256, 256 );

		// create color only once here, reuse it later inside the render function
		this.clearColor = new Color( 0, 0, 0 );

		// render targets
		const pars = { minFilter: LinearFilter, magFilter: LinearFilter, format: RGBAFormat };
		this.renderTargetsHorizontal = [];
		this.renderTargetsVertical = [];
		this.nMips = 5;
		
		let resx = Math.round( this.resolution.x / 2 );
		let resy = Math.round( this.resolution.y / 2 );

		this.renderTargetBright = new WebGLRenderTarget( resx, resy, pars );
		this.renderTargetBright.texture.name = 'HighLowBloomPass.bright';
		this.renderTargetBright.texture.generateMipmaps = false;

		for ( let i = 0; i < this.nMips; i ++ ) {
			const renderTargetHorizonal = new WebGLRenderTarget( resx, resy, pars );

			renderTargetHorizonal.texture.name = 'HighLowBloomPass.h' + i;
			renderTargetHorizonal.texture.generateMipmaps = false;

			this.renderTargetsHorizontal.push( renderTargetHorizonal );

			const renderTargetVertical = new WebGLRenderTarget( resx, resy, pars );

			renderTargetVertical.texture.name = 'HighLowBloomPass.v' + i;
			renderTargetVertical.texture.generateMipmaps = false;

			this.renderTargetsVertical.push( renderTargetVertical );

			resx = Math.round( resx / 2 );
			resy = Math.round( resy / 2 );
		}

		// Luminosity high-low pass material

		this.luminosityHighLowMaterial = new LuminosityHighLowMaterial();
		this.luminosityHighLowMaterial.uniforms[ 'luminosityLowThreshold' ].value = thresholdLow;
		this.luminosityHighLowMaterial.uniforms[ 'luminosityHighThreshold' ].value = thresholdHigh;
		this.luminosityHighLowMaterial.uniforms[ 'smoothWidth' ].value = 0.01;

		// Gaussian Blur Materials

		this.separableBlurMaterials = [];
		const kernelSizeArray = [ 3, 5, 7, 9, 11 ];
		resx = Math.round(this.resolution.x / 2);
		resy = Math.round(this.resolution.y / 2);

		for ( let i = 0; i < this.nMips; i ++ ) {
			this.separableBlurMaterials.push(new SeparableBlurMaterial(kernelSizeArray[i]));
			this.separableBlurMaterials[i].uniforms['texSize'].value = new Vector2(resx, resy);

			resx = Math.round(resx / 2);
			resy = Math.round(resy / 2);
		}

		// Composite material

		this.compositeMaterial = new CompositeMaterial(this.nMips);
		this.compositeMaterial.uniforms[ 'blurTexture1' ].value = this.renderTargetsVertical[ 0 ].texture;
		this.compositeMaterial.uniforms[ 'blurTexture2' ].value = this.renderTargetsVertical[ 1 ].texture;
		this.compositeMaterial.uniforms[ 'blurTexture3' ].value = this.renderTargetsVertical[ 2 ].texture;
		this.compositeMaterial.uniforms[ 'blurTexture4' ].value = this.renderTargetsVertical[ 3 ].texture;
		this.compositeMaterial.uniforms[ 'blurTexture5' ].value = this.renderTargetsVertical[ 4 ].texture;
		this.compositeMaterial.uniforms[ 'bloomStrength' ].value = strength;
		this.compositeMaterial.uniforms[ 'bloomRadius' ].value = 0.1;
		this.compositeMaterial.needsUpdate = true;

		const bloomFactors = [ 1.0, 0.8, 0.6, 0.4, 0.2 ];
		this.compositeMaterial.uniforms[ 'bloomFactors' ].value = bloomFactors;
		
		this.bloomTintColors = [ new Vector3( 1, 1, 1 ), new Vector3( 1, 1, 1 ), new Vector3( 1, 1, 1 ), new Vector3( 1, 1, 1 ), new Vector3( 1, 1, 1 ) ];
		this.compositeMaterial.uniforms[ 'bloomTintColors' ].value = this.bloomTintColors;

		// Copy material

		this.copyMaterial = new CopyMaterial();
		this.copyMaterial.uniforms[ 'opacity' ].value = 1.0;

		// Others

		this.enabled = true;
		this.needsSwap = false;

		this._oldClearColor = new Color();
		this.oldClearAlpha = 1;

		this.basic = new MeshBasicMaterial();
		this.fsQuad = new FullScreenQuad();
	}

	dispose() {
		for (let i = 0; i < this.renderTargetsHorizontal.length; i++) {
			this.renderTargetsHorizontal[ i ].dispose();
		}

		for (let i = 0; i < this.renderTargetsVertical.length; i++) {
			this.renderTargetsVertical[ i ].dispose();
		}

		this.renderTargetBright.dispose();
	}

	override setSize(width: number, height: number) {
		let resx = Math.round(width / 2);
		let resy = Math.round(height / 2);

		this.renderTargetBright.setSize( resx, resy );

		for ( let i = 0; i < this.nMips; i ++ ) {
			this.renderTargetsHorizontal[ i ].setSize( resx, resy );
			this.renderTargetsVertical[ i ].setSize( resx, resy );

			this.separableBlurMaterials[ i ].uniforms[ 'texSize' ].value = new Vector2( resx, resy );

			resx = Math.round( resx / 2 );
			resy = Math.round( resy / 2 );
		}

	}

	override render(
        renderer: WebGLRenderer,
        writeBuffer: WebGLRenderTarget,
        readBuffer: WebGLRenderTarget,
        deltaTime: number,
        maskActive: boolean
	) {
		renderer.getClearColor( this._oldClearColor );
		this.oldClearAlpha = renderer.getClearAlpha();
		const oldAutoClear = renderer.autoClear;
		renderer.autoClear = false;

		renderer.setClearColor( this.clearColor, 0 );

		if ( maskActive ) renderer.state.buffers.stencil.setTest( false );

		// Render input to screen

		if ( this.renderToScreen ) {
			this.fsQuad.material = this.basic;
			this.basic.map = readBuffer.texture;

			renderer.setRenderTarget( null );
			renderer.clear();
			this.fsQuad.render( renderer );
		}

		// 1. Extract Bright Areas

		this.luminosityHighLowMaterial.uniforms[ 'tDiffuse' ].value = readBuffer.texture;
		this.luminosityHighLowMaterial.uniforms[ 'luminosityLowThreshold' ].value = this.thresholdLow;
		this.luminosityHighLowMaterial.uniforms[ 'luminosityHighThreshold' ].value = this.thresholdHigh;
		this.fsQuad.material = this.luminosityHighLowMaterial;

		renderer.setRenderTarget( this.renderTargetBright );
		renderer.clear();
		this.fsQuad.render( renderer );

		// 2. Blur All the mips progressively

		let inputRenderTarget = this.renderTargetBright;

		for ( let i = 0; i < this.nMips; i ++ ) {
			this.fsQuad.material = this.separableBlurMaterials[ i ];

			this.separableBlurMaterials[ i ].uniforms[ 'colorTexture' ].value = inputRenderTarget.texture;
			this.separableBlurMaterials[ i ].uniforms[ 'direction' ].value = this.BlurDirectionX;
			renderer.setRenderTarget( this.renderTargetsHorizontal[ i ] );
			renderer.clear();
			this.fsQuad.render( renderer );

			this.separableBlurMaterials[ i ].uniforms[ 'colorTexture' ].value = this.renderTargetsHorizontal[ i ].texture;
			this.separableBlurMaterials[ i ].uniforms[ 'direction' ].value = this.BlurDirectionY;
			renderer.setRenderTarget( this.renderTargetsVertical[ i ] );
			renderer.clear();
			this.fsQuad.render( renderer );

			inputRenderTarget = this.renderTargetsVertical[ i ];
		}

		// 3. Composite All the mips

		this.fsQuad.material = this.compositeMaterial;
		this.compositeMaterial.uniforms[ 'bloomStrength' ].value = this.strength;
		this.compositeMaterial.uniforms[ 'bloomRadius' ].value = this.radius;
		this.compositeMaterial.uniforms[ 'bloomTintColors' ].value = this.bloomTintColors;

		renderer.setRenderTarget( this.renderTargetsHorizontal[ 0 ] );
		renderer.clear();
		this.fsQuad.render( renderer );

		// 4. Blend it additively over the input texture

		this.fsQuad.material = this.copyMaterial;
		this.copyMaterial.uniforms[ 'tDiffuse' ].value = this.renderTargetsHorizontal[ 0 ].texture;

		if ( maskActive ) renderer.state.buffers.stencil.setTest( true );

		if ( this.renderToScreen ) {
			renderer.setRenderTarget( null );
			this.fsQuad.render( renderer );
		} else {
			renderer.setRenderTarget( readBuffer );
			this.fsQuad.render( renderer );
		}

		// 5. Restore renderer settings

		renderer.setClearColor( this._oldClearColor, this.oldClearAlpha );
		renderer.autoClear = oldAutoClear;
	}
}
